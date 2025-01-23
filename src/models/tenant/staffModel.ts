import { Knex } from 'knex';
import { ITenantStaff } from '../../interfaces/tenantInterface';

class TenantStaffModel {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  /**
   * Add a new tenant staff record to the database.
   * @param tenantStaff - The tenant staff data to insert.
   * @returns The ID of the newly created tenant staff record.
   * @throws Error if the insertion fails.
   */
  async addTenantStaff(tenantStaff: ITenantStaff): Promise<number> {
    try {
      const [id] = await this.knex('tenant_staff').insert(tenantStaff).returning('id');
      return id;
    } catch (error) {
      console.error('Error adding tenant staff:', error);
      throw error;
    }
  }
  /**
   * Retrieve all tenant staff records with optional filtering, pagination, and sorting.
   * @param filter - An optional filter object to apply to the query.
   * @param pagination - Pagination parameters including page and limit.
   * @returns An object containing an array of tenant staff records and total count.
   * @throws Error if the retrieval fails.
   */
  public async getAllTenantStaff(
    filter: { search?: string, location?: string, otherConditions?: object } = {},
    pagination: { page: number; limit: number; searchWithPagination?: boolean },
    type: string = 'staff', // Default type is 'staff'
    sortBy: string = 'first_name', // Default sort column
    sortOrder: 'asc' | 'desc' = 'asc', // Default sort order
  ): Promise<{ staff: ITenantStaff[], totalPages: number, currentPage: number , totalRecords: number}> {
    const { search, location, otherConditions } = filter;
    const { page, limit, searchWithPagination } = pagination;

    const query = this.knex('tenant_staff').where(builder => {
      if (search) {
        builder.where(subBuilder => {
          subBuilder.whereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", [`%${search}%`])
            .orWhere('email_id', 'ILIKE', `%${search}%`)
            .orWhere('mobile_number', 'ILIKE', `%${search}%`)
            
        });
      }
      if (type) {
        builder.andWhere(subBuilder => {
          subBuilder.where('staff_type', type)
            .orWhereRaw("CONCAT(first_name, ' ', last_name) ILIKE ?", [`%${type}%`])
            .orWhere('email_id', 'ILIKE', `%${type}%`)
            .orWhere('mobile_number', 'ILIKE', `%${type}%`);
        });
      }
      if (location !== 'all' && location !== undefined && location !== null && location !== '') {
        builder.andWhere('tenant_address_id', location);
      }
      if (otherConditions) {
        builder.where(otherConditions);
      }
    });

    let totalCount = -1;
    let totalPages = -1; // Calculate total pages
    let staff;

    if(searchWithPagination === false) {
      staff = await query.clone()
        .select('staff_uuid','first_name', 'last_name', 'profile_pic', 'staff_bio', 'provider_specializations','staff_status','is_deleted','mobile_number','country_code','staff_commission') // Select only these fields
        .orderBy(sortBy, sortOrder) // Sort results
    } else {
      totalCount = await query.clone().count<{ count: number }[]>('staff_uuid as count').then(rows => rows[0].count);
      totalPages = Math.ceil(totalCount / limit); // Calculate total pages
      staff = await query.clone()
        .select('staff_uuid','first_name', 'last_name', 'profile_pic', 'staff_bio', 'provider_specializations','staff_status','is_deleted','mobile_number','country_code','staff_commission') // Select only these fields
        .orderBy(sortBy, sortOrder) // Sort results
        .offset((page - 1) * limit)
        .limit(limit);
    }

    return { staff, totalPages, currentPage: page , totalRecords: totalCount}; // Return staff, total pages, and current page
  }

  /**
   * Find tenant staff by their email address.
   * @param email - The email address to search for.
   * @returns The tenant staff record with the specified email, or undefined if not found.
   * @throws Error if the query fails.
   */
  public async findByEmail(email: string) {
    try {
      return await this.knex('tenant_staff').where({ email_id: email }).first();
    } catch (error) {
      throw new Error(`TenantStaffModel findByEmail error: ${error}`);
    }
  }

  /**
   * Find tenant staff by their UUID.
   * @param UUID - The UUID to search for.
   * @returns The tenant staff record with the specified UUID, or undefined if not found.
   * @throws Error if the query fails.
   */
  public async findByUUID(UUID: string) {
    try {
      const staff = await this.knex('tenant_staff')
        .where({ staff_uuid: UUID })
        .first(
          'id',
          'staff_uuid',
          'password',
          'first_name',
          'last_name',
          'email_id',
          'mobile_number',
          'country_code',
          'phone_number',
          'phone_country_code',
          'tenant_address_id',
          'staff_brief',
          'date_of_joining',
          'staff_gender',
          'address_line1',
          'address_line2',
          'city',
          'state',
          'country',
          'pincode',
          'profile_pic',
          'staff_type',
          'staff_status',
          'is_deleted',
          'staff_bio',
          'created_by',
          'provider_specializations',
          'staff_experience',
          'staff_commission',
          'date_of_exit'
        );

      if (!staff) {
        return undefined;
      }

      const roles = await this.knex('role_link')
        .join('roles', 'role_link.role_id', 'roles.id')
        .where('role_link.staff_id', staff.id)
        .select('roles.id as roleId', 'roles.role_name as roleName'); // Updated column name

      return { ...staff, roles };
    } catch (error) {
      throw new Error(`TenantStaffModel findByUUID error: ${error}`);
    }
  }

  /**
   * Find tenant staff by their phone number.
   * @param phone - The phone number to search for.
   * @returns The tenant staff record with the specified phone number, or undefined if not found.
   * @throws Error if the query fails.
   */
  public async findByPhone(phone: string) {
    try {
      return await this.knex('tenant_staff').where({ phone_number: phone }).first(); // Adjust the column name as necessary
    } catch (error) {
      throw new Error(`TenantStaffModel findByPhone error: ${error}`);
    }
  }

  /**
   * Update an existing tenant staff record by ID.
   * @param id - The ID of the tenant staff record to update.
   * @param updates - The updates to apply to the tenant staff record.
   * @returns The ID of the updated tenant staff record.
   * @throws Error if the update fails.
   */
  public async updateTenantStaff(id: string, updates: Partial<ITenantStaff>) {
    try {
      const [updatedId] = await this.knex('tenant_staff').where('staff_uuid', id).update(updates).returning('staff_uuid');
      return updatedId;
    } catch (error) {
      console.error('Error updating tenant staff:', error);
      throw error;
    }
  }

  /**
   * Delete a tenant staff record by ID.
   * @param id - The ID of the tenant staff record to delete.
   * @throws Error if the deletion fails.
   */
  public async deleteTenantStaff(id: string): Promise<void> {
    try {
      await this.knex('tenant_staff').where('staff_uuid', id).del();
    } catch (error) {
      console.error('Error deleting tenant staff:', error);
      throw error;
    }
  }

  /**
   * Assign one or multiple roles to a staff member.
   * @param staffId - ID of the staff member.
   * @param roleIds - Array of role IDs to assign.
   * @returns The inserted role link entries.
   * @throws Error if the assignment fails.
   */
  public async assignRolesToStaff(staffId: number, roleIds: number[]) {
    try {
      const roleLinks = roleIds.map(roleId => ({ staff_id: staffId, role_id: roleId }));
      await this.knex('role_link').insert(roleLinks);
      return
    } catch (error) {
      throw new Error(`RoleModel assignRolesToStaff error: ${error}`);
    }
  }

  public async getRolesByStaffId(staffId: number) {
    try {
      return await this.knex('role_link').where({ staff_id: staffId }).select('role_id'); // Fetch role IDs for the staff
    } catch (error) {
      throw new Error(`TenantStaffRepository getRolesByStaffId error: ${error}`);
    }
  }

  /**
   * Insert or update roles for a staff member.
   * @param staffId - ID of the staff member.
   * @param roleIds - Array of role IDs to assign.
   * @throws Error if the operation fails.
   */
  public async insertOrUpdateRolesForStaff(staffId: number, roleIds: number[]) {
    try {
      // Fetch existing role IDs for the staff member
      const existingRoles = await this.getRolesByStaffId(staffId);
      const existingRoleIds = existingRoles.map(role => role.role_id);

      // Determine roles to insert (new roles)
      const rolesToInsert = roleIds.filter(roleId => !existingRoleIds.includes(roleId));
      // Determine roles to delete (removed roles)
      const rolesToDelete = existingRoleIds.filter(roleId => !roleIds.includes(roleId));

      // Insert new roles
      if (rolesToInsert.length > 0) {
        const roleLinksToInsert = rolesToInsert.map(roleId => ({ staff_id: staffId, role_id: roleId }));
        await this.knex('role_link').insert(roleLinksToInsert);
      }

      // Delete removed roles
      if (rolesToDelete.length > 0) {
        await this.knex('role_link').where({ staff_id: staffId }).whereIn('role_id', rolesToDelete).del();
      }
    } catch (error) {
      throw new Error(`TenantStaffModel insertOrUpdateRolesForStaff error: ${error}`);
    }
  }
}

export default TenantStaffModel;
