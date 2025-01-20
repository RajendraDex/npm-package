import { Knex } from 'knex';
import { ITenant } from '../../interfaces/tenantInterface';
import { tenantColumnMappings } from '../../helpers/tenants/columnMapping';

class TenantModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Fetch tenants with pagination, sorting, and filtering options.
   * @param page - The page number to fetch.
   * @param limit - Number of tenants per page.
   * @param sortBy - Column name to sort by.
   * @param sortOrder - Sorting order ('asc' or 'desc').
   * @param searchQuery - Query string to search tenants by name, email, or phone number.
   * @param status - Optional filter for tenant status.
   * @returns An object containing the list of tenants, total pages, and current page.
   * @throws Error if fetching tenants fails.
   */
  public async fetchTenants(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    searchQuery: string,
    status?: number
  ) {
    try {
      const offset = (page - 1) * limit;
      const column = tenantColumnMappings[sortBy] || 'created_at'; // Default to 'created_at' if sortBy is not mapped

      // Get total number of tenants matching the criteria
      const totalCountResult = await this.db('tenant_master')
        .count<{ count: string }[]>('id as count')
        .where(builder => {
          if (searchQuery) {
            builder.where('tenant_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('email_id', 'ILIKE', `%${searchQuery}%`)
              .orWhere('phone_number', 'ILIKE', `%${searchQuery}%`);
          }
          if (status !== undefined) {
            builder.where('tenant_status', status);
          }
        });

      const totalCount = parseInt(totalCountResult[0].count, 10);
      const totalPages = Math.ceil(totalCount / limit);

      // Fetch tenants with the specified columns
      const result = await this.db('tenant_master')
        .select(
          'tenant_uuid',
          'tenant_name',
          'email_id',
          'phone_number',
          'country_code',
          'tenant_status',
          'contact_first_name',
          'contact_last_name',
          'tenant_subdomain'
        )
        .where(builder => {
          if (searchQuery) {
            builder.where('tenant_name', 'ILIKE', `%${searchQuery}%`)
              .orWhere('email_id', 'ILIKE', `%${searchQuery}%`)
              .orWhere('phone_number', 'ILIKE', `%${searchQuery}%`);
          }
          if (status !== undefined) {
            builder.where('tenant_status', status);
          }
        })
        .orderBy(column, sortOrder)
        .offset(offset)
        .limit(limit);
        
      return {
        result,
        totalPages, // Include total pages in the response
        currentPage: page,
        totalRecords: totalCount
      };
    } catch (error) {
      throw new Error(`TenantModel fetchTenants error: ${error}`);
    }
  }

  /**
   * Update the status of a tenant by UUID.
   * @param tenantUUID - UUID of the tenant to update.
   * @param status - New status to set.
   * @returns The updated tenant details.
   * @throws Error if the update fails.
   */
  public async updateTenantStatus(tenantUUID: string, status: number) {
    try {
      const updatedTenant = await this.db('tenant_master')
        .where({ tenant_uuid: tenantUUID })
        .update({ tenant_status: status })
        
      return updatedTenant;
    } catch (error) {
      throw new Error(`TenantModel updateTenantStatus error: ${error}`);
    }
  }

  /**
   * Find a tenant by its UUID.
   * @param tenantUUID - UUID of the tenant to find.
   * @returns The tenant with the specified UUID.
   * @throws Error if the lookup fails.
   */
  public async findByUUID(tenantUUID: string) {
    try {
      return await this.db('tenant_master').where({ tenant_uuid: tenantUUID }).first();
    } catch (error) {
      throw new Error(`TenantModel findByUUID error: ${error}`);
    }
  }

  /**
   * Find a tenant by its domain name.
   * @param domainName - Domain name of the tenant to find.
   * @returns The tenant with the specified domain name.
   * @throws Error if the lookup fails.
   */
  public async findByDomainName(domainName: string) {
    try {
      return await this.db('tenant_master').where({ tenant_subdomain: domainName }).first();
    } catch (error) {
      throw new Error(`TenantModel findByDomainName error: ${error}`);
    }
  }

  /**
   * Create a new tenant.
   * @param tenant - Data for the new tenant.
   * @returns The newly created tenant.
   * @throws Error if the creation fails.
   */
  public async createTenant(tenant: Partial<ITenant>) {
    try {
      return await this.db('tenant_master').insert(tenant).returning('*');
    } catch (error) {
      throw new Error(`TenantModel createTenant error: ${error}`);
    }
  }

  /**
   * Update an existing tenant by UUID.
   * @param tenantUUID - UUID of the tenant to update.
   * @param tenantData - Data to update the tenant with.
   * @returns The updated tenant details.
   * @throws Error if the update fails.
   */
  public async updateTenant(tenantUUID: string, tenantData: Partial<ITenant>) {
    try {
      return await this.db('tenant_master')
        .where({ tenant_uuid: tenantUUID })
        .update(tenantData)
        .returning('*');
    } catch (error) {
      throw new Error(`TenantModel updateTenant error: ${error}`);
    }
  }

  /**
   * Delete a tenant by UUID.
   * @param tenantUUID - UUID of the tenant to delete.
   * @returns The number of rows affected (should be 1 if successful).
   * @throws Error if the deletion fails.
   */
  public async deleteTenant(tenantUUID: string) {
    try {
      return await this.db('tenant_master').where({ tenant_uuid: tenantUUID }).del();
    } catch (error) {
      throw new Error(`TenantModel deleteTenant error: ${error}`);
    }
  }
}

export default TenantModel;
