import { Knex } from 'knex';

class RoleModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Create a new role in the 'roles' table.
   * @param roleData - Data for the new role.
   * @returns The newly created role.
   * @throws Error if the creation fails.
   */
  public async createRole(roleData: any) {
    try {
      return await this.db('roles').insert(roleData).returning('*');
    } catch (error) {
      throw new Error(`RoleModel createRole error: ${error}`);
    }
  }

  /**
   * Update an existing role in the 'roles' table.
   * @param id - ID of the role to update.
   * @param roleData - Data to update the role with.
   * @returns The updated role.
   * @throws Error if the update fails.
   */
  public async updateRole(id: number, roleData: any) {
    try {
      return await this.db('roles')
        .where({ id })
        .update(roleData)
        .returning('*');
    } catch (error) {
      throw new Error(`RoleModel updateRole error: ${error}`);
    }
  }

  /**
   * Retrieve all roles from the 'roles' table.
   * @returns An array of all roles.
   * @throws Error if the retrieval fails.
   */
  public async getRoles() {
    try {
      return await this.db('roles').select('*');
    } catch (error) {
      throw new Error(`RoleModel getRoles error: ${error}`);
    }
  }

  /**
   * Retrieve roles by ID(s) from the 'roles' table.
   * @param id - Optional ID of the role to retrieve.
   * @returns An array of roles matching the ID(s).
   * @throws Error if the retrieval fails.
   */
  public async getRolesById(id?: number) {
    try {
      const query = this.db('roles').select('*');
      if (id) {
        query.where({ id });
      }
      return await query;
    } catch (error) {
      throw new Error(`RoleModel getRolesById error: ${error}`);
    }
  }

  /**
   * Retrieve roles by name from the 'roles' table.
   * @param roleName - Name of the role to retrieve.
   * @returns An array of roles matching the name.
   * @throws Error if the retrieval fails.
   */
  public async getRolesByName(roleName: string): Promise<any[]> {
    try {
      return await this.db('roles').where('role_name', roleName).select('*');
    } catch (error) {
      throw new Error(`RoleModel getRolesByName error: ${error}`);
    }
  }

  /**
   * Retrieve roles associated with a specific user ID.
   * @param userId - ID of the user.
   * @param isTenant - Boolean indicating whether the user is a tenant.
   * @returns An array of roles associated with the user.
   * @throws Error if the retrieval fails.
   */
  public async getRolesByUserId(userId: number, isTenant: boolean) {
    const userIdColumn = isTenant ? 'staff_id' : 'admin_id';
    try {
      return await this.db('role_link')
        .join('roles', 'roles.id', '=', 'role_link.role_id')
        .where(`role_link.${userIdColumn}`, userId)
        .select('roles.role_name');
    } catch (error) {
      throw new Error(`RoleModel getRolesByUserId error: ${error}`);
    }
  }

  /**
   * Retrieve permissions associated with a specific user ID.
   * @param userId - ID of the user.
   * @param isTenant - Boolean indicating whether the user is a tenant.
   * @returns An array of permissions associated with the user.
   * @throws Error if the retrieval fails.
   */
  public async getPermissionsByUserId(userId: number, isTenant: boolean) {
    const userIdColumn = isTenant ? 'staff_id' : 'admin_id';

    try {
      return await this.db('role_link')
        .join('roles', 'roles.id', '=', 'role_link.role_id')
        .where(`role_link.${userIdColumn}`, userId)
        .select('roles.role_permissions');
    } catch (error) {
      throw new Error(`RoleModel getPermissionsByUserId error: ${error}`);
    }
  }

  /**
   * Retrieve permissions by their IDs.
   * @param ids - Array of permission IDs to retrieve.
   * @returns An array of permissions matching the IDs.
   * @throws Error if the retrieval fails.
   */
  public async getPermissionsByIds(ids: number[]): Promise<any[]> {
    try {
      return await this.db('permission_master').select('id', 'permission_name').whereIn('id', ids);
    } catch (error) {
      throw new Error(`RoleModel getPermissionsByIds error: ${error}`);
    }
  }

  /**
   * Check if a role is associated with any entities in the 'role_link' table.
   * @param roleId - ID of the role to check.
   * @returns Boolean indicating whether the role is associated with any entities.
   * @throws Error if the check fails.
   */
  public async checkRoleAssociation(roleId: number): Promise<boolean> {
    try {
      const exists = await this.db('role_link').where('role_id', roleId).first();
      return !!exists;
    } catch (error) {
      throw new Error(`RoleModel checkRoleAssociation error: ${error}`);
    }
  }

  /**
   * Retrieve a permission by its ID.
   * @param permissionId - ID of the permission to retrieve.
   * @returns The permission matching the ID.
   * @throws Error if the retrieval fails.
   */
  public async getPermissionById(permissionId: number) {
    try {
      return await this.db('permission_master').where('id', permissionId).first();
    } catch (error) {
      throw new Error(`RoleModel getPermissionById error: ${error}`);
    }
  }

  /**
   * Delete a role by its ID.
   * @param roleId - ID of the role to delete.
   * @returns The number of rows affected (should be 1 if successful).
   * @throws Error if the deletion fails.
   */
  public async deleteRoleById(roleId: number): Promise<number> {
    try {
      return await this.db('roles').where('id', roleId).del();
    } catch (error) {
      throw new Error(`RoleModel deleteRoleById error: ${error}`);
    }
  }
}

export default RoleModel;
