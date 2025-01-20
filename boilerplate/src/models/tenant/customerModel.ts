import { Knex } from 'knex';
import { TenantCustomer } from '../../interfaces/tenantInterface';
import { customerColumnMappings } from '../../helpers/tenants/columnMapping';

class CustomerModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db; // Initialize the database instance
  }

  /**
   * Create a new customer.
   * @param customerData - The customer data to insert.
   * @returns An array of the newly created customer(s).
   * @throws Error if the creation fails.
   */
  public async createCustomer(customerData: any): Promise<TenantCustomer[]> {
    try {
      // Insert the new customer into the 'tenant_customers' table and return the newly created customer(s)
      return await this.db('tenant_customers').insert(customerData).returning('*');
    } catch (error) {
      throw new Error(); // Catch and throw an error if creation fails
    }
  }

  /**
   * Update an existing customer by ID.
   * @param id - The ID of the customer to update.
   * @param customerData - The data to update.
   * @returns The updated customer(s).
   * @throws Error if the update fails.
   */
  public async updateCustomer(id: String, customerData: Partial<Omit<TenantCustomer, 'id'>>): Promise<TenantCustomer[]> {
    try {
      // Update the customer with the specified ID and return the updated customer(s)
      return await this.db('tenant_customers')
        .where({ customer_uuid: id })
        .update(customerData)
        .returning('*');
    } catch (error) {
      throw new Error(); // Catch and throw an error if update fails
    }
  }

  /**
   * Retrieve all customers.
   * @returns An array of all customers.
   * @throws Error if the retrieval fails.
   */
  public async getCustomers(): Promise<TenantCustomer[]> {
    try {
      // Fetch and return all customers from the 'tenant_customers' table
      return await this.db('tenant_customers').select('*');
    } catch (error) {
      throw new Error(); // Catch and throw an error if retrieval fails
    }
  }

  /**
   * Fetch customers with pagination, sorting, and searching.
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @param sortBy - The column to sort by.
   * @param sortOrder - The order to sort (asc/desc).
   * @param searchQuery - The search query for filtering results.
   * @param status - Optional status filter.
   * @param isDeleted - Optional isDeleted filter.
   * @returns An object with customers and pagination information.
   * @throws Error if the fetch fails.
   */
  public async fetchCustomers(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
    status?: number,
    isDeleted?: number
  ): Promise<{ result: any[], totalPages: number, currentPage: number, totalRecords: number}> {
    try {
      const column = customerColumnMappings[sortBy] || 'created_at'; // Default to 'created_at' if sortBy is not provided

      // Get total number of customers matching the criteria
      const totalCountResult = await this.db('tenant_customers')
        .count<{ count: string }[]>('id as count')
        .where(builder => {
          if (searchQuery) {
            builder.where('first_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('last_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('phone_number','ILIKE',`%${searchQuery}%`)
              .orWhere('email_id', 'ILIKE', `%${searchQuery}%`);
          }
          if (status !== undefined) {
            builder.where('customer_status', status);
          }
          if (isDeleted !== undefined) {
            builder.where('tenant_customers.is_deleted', isDeleted);
          }
        });

      const totalCount = parseInt(totalCountResult[0].count, 10); // Parse total count
      const totalPages = limit === -1 ? 1 : Math.ceil(totalCount / limit); // Calculate total pages

      // Fetch customers with pagination, sorting, and searching
      const query = this.db('tenant_customers')
        .leftJoin('promotion_customer_link', (join) => {
          join.on('tenant_customers.id', '=', 'promotion_customer_link.customer_id')
              .andOn('promotion_customer_link.is_deleted', '=', this.db.raw('?', [0]))
              .andOn('promotion_customer_link.link_status', '=', this.db.raw('?', [1]))
              .andOnNotNull('promotion_customer_link.expiry_date');
        })
        .leftJoin('promotion_offer', 'promotion_customer_link.promo_id', 'promotion_offer.id')
        .leftJoin('tenant_customer_wallet', 'tenant_customers.id', 'tenant_customer_wallet.customer_id')
        .select(
          'tenant_customers.*', 
          'promotion_offer.promotion_uuid as promotion_id', 
          'promotion_offer.promotion_name',
          this.db.raw('ROUND(tenant_customer_wallet.current_balance, 2) as wallet_balance')
        )
        .where(builder => {
          if (searchQuery) {
            builder.where('first_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('last_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('phone_number','ILIKE',`%${searchQuery}%`)
              .orWhere('email_id', 'ILIKE', `%${searchQuery}%`);
          }
          if (status !== undefined) {
            builder.where('customer_status', status);
          }
          if (isDeleted !== undefined) {
            builder.where('tenant_customers.is_deleted', isDeleted);
          }
        })
        .modify(queryBuilder => {
          if (status !== undefined || isDeleted !== undefined) {
            queryBuilder.andWhere(builder => {
              if (status !== undefined) {
                builder.where('customer_status', status);
              }
              if (isDeleted !== undefined) {
                builder.where('tenant_customers.is_deleted', isDeleted);
              }
            });
          }
        })
        .orderBy(column, sortOrder); // Sort results

      if (limit !== -1) {
        query.offset((page - 1) * limit).limit(limit); // Apply pagination offset and limit if limit is not -1
      }

      const result = await query;
      return {
        result,
        totalPages,
        currentPage: page, // Return pagination info
        totalRecords: totalCount
      };
    } catch (error) {
      throw new Error(); // Catch and throw an error if fetch fails
    }
  }

  /**
   * Retrieve a customer by ID.
   * @param id - The ID of the customer to retrieve.
   * @returns The customer with the specified ID, or undefined if not found.
   * @throws Error if the retrieval fails.
   */
  public async getCustomerById(id: String): Promise<any> {
    try {

      // Fetch and return the customer with the specified ID along with linked promotion details
      const customer = await this.db('tenant_customers')
        .leftJoin('tenant_customer_wallet', 'tenant_customers.id', 'tenant_customer_wallet.customer_id')
        .select('tenant_customers.*', 'tenant_customer_wallet.current_balance')
        .where({ customer_uuid: id })
        .first();
      if (!customer) {
        return undefined; // Return undefined if customer is not found
      }

      // Fetch linked promotion details where is_deleted is 0 and the promotion is not expired
      const promotions = await this.db('promotion_customer_link')
        .join('promotion_offer', 'promotion_customer_link.promo_id', 'promotion_offer.id')
        .where({
          'promotion_customer_link.customer_id': customer.id,
          'promotion_customer_link.is_deleted': 0,
          'promotion_customer_link.link_status': 1
        })
        .andWhere('promotion_customer_link.expiry_date', '>', this.db.raw('CURRENT_DATE'))
        .select('promotion_offer.promotion_name', 'promotion_customer_link.pay_price', 'promotion_customer_link.get_price', 'promotion_offer.offer_duration', 'promotion_customer_link.expiry_date', 'promotion_customer_link.purchase_date','promotion_offer.promotion_uuid');

      return {
        ...customer,
        promotions
      };
    } catch (error) {
      throw new Error(); // Catch and throw an error if retrieval fails
    }
  }

  /**
   * Retrieve a customer by a specific field.
   * @param fieldName - The column name to search by (e.g., 'email_id', 'phone_number').
   * @param fieldValue - The value of the field to search for.
   * @returns The customer with the specified field value, or undefined if not found.
   * @throws Error if the retrieval fails.
   */
  public async getCustomerByField(fieldName: string, fieldValue: string | number): Promise<TenantCustomer | undefined> {
    try {
      // Fetch and return the customer with the specified field value
      return await this.db('tenant_customers').where({ [fieldName]: fieldValue }).first();
    } catch (error) {
      throw new Error(); // Catch and throw an error if retrieval fails
    }
  }

  /**
   * Delete a customer by ID.
   * @param id - The ID of the customer to delete.
   * @returns The number of rows deleted.
   * @throws Error if the deletion fails.
   */
  public async deleteCustomerById(id: number): Promise<number> {
    try {
      // Delete the customer with the specified ID and return the number of rows deleted
      return await this.db('tenant_customers').where({ id }).del();
    } catch (error) {
      throw new Error(); // Catch and throw an error if deletion fails
    }
  }

  /**
   * Update specific fields of a customer.
   * @param customerUUID - The UUID of the customer to update.
   * @param fieldsToUpdate - An object with the fields to update.
   * @returns The updated customer details.
   * @throws Error if the update fails.
   */
  public async updateCustomerFields(customerUUID: string, fieldsToUpdate: Partial<{ status: number; isDeleted: number }>) {
    try {
      // Update the specified fields of the customer and return the updated details
      const updatedCustomer = await this.db('tenant_customers')
        .where({ customer_uuid: customerUUID })
        .update({
          customer_status: fieldsToUpdate.status,
          is_deleted: fieldsToUpdate.isDeleted,
          updated_at: new Date(), // Update the timestamp
        })
        .returning('id'); // Return the updated customer details

      return updatedCustomer;
    } catch (error) {
      throw new Error(); // Catch and throw an error if update fails
    }
  }
  
}

export default CustomerModel;
