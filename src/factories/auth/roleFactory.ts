import RoleModel from '../../models/master/roleModel';
import { ErrorMessages, RoleMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';
class RoleFactory {
  private roleModel: RoleModel;

  /**
   * Constructor for RoleFactory
   * 
   * @param dbName - The name of the database to connect to.
   */
  constructor(db:Knex) {
    this.roleModel = new RoleModel(db);
  }

  /**
   * Create a new role
   * 
   * @param roleData - The data for the new role.
   * @returns The newly created role.
   * @throws Will throw an error if the role already exists or if there's a database error.
   */
  public async createRole(roleData: any) {
    try {
      // Check if a role with the same name already exists
      const existingRoles = await this.roleModel.getRolesByName(roleData.role_name);
      if (existingRoles.length > 0) {
        throw new Error(RoleMessages.RoleAlreadyExists);
      }

      // Create and return the new role
      return await this.roleModel.createRole(roleData);
    } catch (error: unknown) {
      throw error;
    }
  }

  /**
   * Update an existing role
   * 
   * @param roleId - The ID of the role to update.
   * @param roleData - The new data for the role.
   * @returns The updated role.
   * @throws Will throw an error if the role does not exist or if there's a database error.
   */
  public async updateRole(roleId: number, roleData: any) {
    try {
      // Ensure the role exists
      const existingRole = await this.roleModel.getRolesById(roleId);
      if (!existingRole || existingRole.length === 0) {
        throw new Error(RoleMessages.RoleNotFound);
      }

      // Convert role permissions to JSON if provided
      if (roleData.role_permissions) {
        roleData.role_permissions = JSON.stringify(roleData.role_permissions);
      }

      // Update and return the role
      return await this.roleModel.updateRole(roleId, roleData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Get a role by its ID
   * 
   * @param id - The ID of the role to retrieve.
   * @returns The role with its associated permissions.
   * @throws Will throw an error if the role does not exist or if there's a database error.
   */
  public async getRoleById(id: number): Promise<any> {
    try {
      // Retrieve the role by ID
      const roles = await this.roleModel.getRolesById(id);
      if (!roles || roles.length === 0) {
        throw new Error(RoleMessages.RoleNotFound);
      }

      // Retrieve associated permissions
      const role = roles[0];
      const permissionIds = role.role_permissions.map((permission: any) => permission.permission_id);
      const permissions = await this.roleModel.getPermissionsByIds(permissionIds);
      
      // Map permissions to their names
      const permissionMap = new Map<number, string>();
      permissions.forEach(permission => {
        permissionMap.set(permission.id, permission.permission_name);
      });

      // Format the role with its permissions
      const formattedGrants = role.role_permissions.map((permission: any) => ({
        resource: permissionMap.get(permission.permission_id),
        actions: permission.permission_operations,
        id: permission.permission_id,
      }));
      const roleWithPermissions = {
        id: role.id,
        role: role.role_name,
        description:role. role_description,
        grants: formattedGrants,
      };

      return roleWithPermissions;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieve all roles
   * 
   * @returns A list of all roles.
   * @throws Will throw an error if there's a database error.
   */
  public async getRoles() {
    try {
      // Fetch all roles using the roleModel
      return await this.roleModel.getRoles();
   
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }
  

  /**
   * Delete a role by its ID
   * 
   * @param roleId - The ID of the role to delete.
   * @returns An object indicating success or failure and a message.
   * @throws Will throw an error if the role is associated with a user or if there's a database error.
   */
  public async deleteRoleById(roleId: number): Promise<{ success: boolean, message: string }> {
    try {
      // Check if the role is associated with any user
      const isAssociated = await this.roleModel.checkRoleAssociation(roleId);
      if (isAssociated) {
        throw new Error(RoleMessages.RoleAssociatedWithUser);
      }

      // Attempt to delete the role
      const result = await this.roleModel.deleteRoleById(roleId);

      if (result === 0) {
        // No role found with the given ID
        return { success: false, message: RoleMessages.RoleNotFound };
      }

      // Role successfully deleted
      return { success: true, message: RoleMessages.RoleDeleted };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }
}

export default RoleFactory;
