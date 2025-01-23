import { Knex, QueryBuilder } from 'knex';
import { IAddress } from '../../interfaces/tenantInterface';

class AddressModel {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  /**
   * Add a new address to the tenant_address table.
   * @param address - The address data to insert.
   * @returns The ID of the newly created address.
   * @throws Error if the insertion fails.
   */
  async addAddress(address: IAddress): Promise<number> {
    try {
      // Insert the new address and return the ID of the newly created address.
      const [id] = await this.knex('tenant_address').insert(address).returning('id');
      return id.id;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  /**
   * Retrieve all addresses from the tenant_address table.
   * @returns A list of all addresses.
   * @throws Error if the retrieval fails.
   */
  async getAddress() {
    try {
      // Fetch and return all addresses.
      const address = await this.knex('tenant_address').select('*');
      return address;
    } catch (error) {
      console.error('Error in getting address:', error);
      throw error;
    }
  }

  /**
   * Update an existing address in the tenant_address table.
   * @param id - The ID of the address to update.
   * @param updates - The updates to apply to the address record.
   * @returns The ID of the updated address record.
   * @throws Error if the update fails.
   */
  async updateAddress(updates: Partial<IAddress>): Promise<number> {
    try {
      const [updatedId] = await this.knex('tenant_address').update(updates).where('address_type',1).returning('id');
      return updatedId.id;
    } catch (error) {
      throw error;
    }
  }

  public async addressList(page: number, limit: number, sortBy: string, sortOrder: string, searchQuery: string, status: string) {
    const offset = (page - 1) * limit;
    const applyFilters = (queryBuilder: any) => {
      if (status !== 'ALL' && status !== '') {
        queryBuilder.where('status', status);
      }
      if (searchQuery) {
        queryBuilder.whereRaw("CONCAT(address_line1, ' ', address_line2) ILIKE ?", [`%${searchQuery}%`]);
      }
      queryBuilder.whereNot('id', 1).andWhereNot('address_type', 1);
    };
    try {
      // Base query with filters applied
      const baseQuery = this.knex('tenant_address')
        .modify(applyFilters);

      // Clone the base query to fetch the actual addresses with pagination
      const query = baseQuery.clone()
        .select(
          'id as locationId',
          this.knex.raw("CONCAT(address_line1, ' ', COALESCE(address_line2, '')) as locationName"),
          this.knex.raw("CONCAT(contact_first_name, ' ', contact_last_name) as contactPersonName"),
          'phone_number as phoneNumber',
          'status',
          'country_code as contactPhoneNumberCountryCode'

        );

      // Handle sorting based on the column
      switch (sortBy) {
        case 'location_name':
          query.orderByRaw("CONCAT(address_line1, ' ', COALESCE(address_line2, '')) " + sortOrder);
          break;
        case 'contact_person_name':
          query.orderByRaw("CONCAT(contact_first_name, ' ', contact_last_name) " + sortOrder);
          break;
        default:
          query.orderBy(sortBy, sortOrder);
      }

      query.offset(offset).limit(limit);
      const addresses = await query;

      // Query to fetch the total count of records for pagination
      const totalRecordsQuery = this.knex('tenant_address')
        .modify(applyFilters)
        .countDistinct('id as count')
        .first();

      const totalRecords = await totalRecordsQuery;

      const result = {
        addresses,
        totalPages: Math.ceil(Number(totalRecords.count) / limit),
        currentPage: page,
        totalRecords: Number(totalRecords.count)
      };
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default AddressModel;
