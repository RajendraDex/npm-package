import { Request } from 'express';
import RoleFactory from '../../factories/auth/roleFactory';
import { DatabaseMessages, ErrorMessages, RoleMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';

class RoleService {
  /**
   * Retrieves the Knex database instance from the request object.
   * 
   * @param req - The Express request object containing the Knex instance.
   * @returns The Knex database instance.
   * @throws Error if the Knex instance is not found in the request.
   */
  private getdb(req: Request): Knex {
    const db = (req as any).knex;
    if (!db) {
      throw new Error(DatabaseMessages.DatabaseNotConfigured);
    }
    return db;
  }

  /**
   * Creates a new role with specified details and permissions.
   * 
   * @param req - The Express request object containing role details in the body.
   * @returns The ID of the created role.
   * @throws Error if the role already exists or if there is an internal server error.
   */
  public async createRole(req: Request) {
    const { roleName, roleDescription, grants } = req.body;
    const db = this.getdb(req);

    try {
      const roleFactory = new RoleFactory(db);

      // Format permissions for the role
      let formattedPermissions = grants.map((permission: any) => ({
        permission_id: permission.id,
        permission_operations: permission.actions,
      }));
      formattedPermissions = JSON.stringify(formattedPermissions);

      // Create the role using the RoleFactory
      return await roleFactory.createRole({
        role_name: roleName,
        role_description: roleDescription,
        role_permissions: formattedPermissions,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case RoleMessages.RoleAlreadyExists:
            throw new Error(RoleMessages.RoleAlreadyExists);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Updates an existing role identified by its ID.
   * 
   * @param req - The Express request object containing role ID in the parameters and updated details in the body.
   * @returns The updated role details.
   * @throws Error if the role is not found or if there is an internal server error.
   */
  public async updateRole(req: Request): Promise<any> {
    const roleId = parseInt(req.params.id);
    const { roleName, roleDescription, grants } = req.body;
    const db = this.getdb(req);

    try {
      const roleFactory = new RoleFactory(db);

      // Format permissions for the role
      let formattedPermissions = grants.map((permission: any) => ({
        permission_id: permission.id,
        permission_operations: permission.actions,
      }));

      // Update the role using the RoleFactory
      const updatedRole = await roleFactory.updateRole(roleId, {
        role_name: roleName,
        role_description: roleDescription,
        role_permissions: formattedPermissions,
      });
  
      if (!updatedRole || updatedRole.length === 0) {
        throw new Error(RoleMessages.RoleNotFound);
      }
      return updatedRole[0];
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case RoleMessages.RoleNotFound:
            throw new Error(RoleMessages.RoleNotFound);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves all roles from the database.
   * 
   * @param req - The Express request object.
   * @returns An array of role objects, each containing role name and ID.
   * @throws Error if there is an internal server error.
   */
  public async getRoles(req: Request) {
    const db = this.getdb(req);

    try {
      const roleFactory = new RoleFactory(db);
      const result = await roleFactory.getRoles();
      
      // Format the roles for response
      const formattedRoles = result.map((role: any) => ({
        role: role.role_name,
        roleId: role.id     
      }));
  
      return formattedRoles;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves a specific role by its ID.
   * 
   * @param req - The Express request object containing the role ID in the parameters.
   * @returns The role details.
   * @throws Error if the role is not found or if there is an internal server error.
   */
  public async getRoleById(req: Request): Promise<any> {
    const db = this.getdb(req);

    try {
      const roleFactory = new RoleFactory(db);
      return await roleFactory.getRoleById(Number(req.params.id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case RoleMessages.RoleNotFound:
            throw new Error(RoleMessages.RoleNotFound);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Deletes a specific role by its ID.
   * 
   * @param req - The Express request object containing the role ID in the parameters.
   * @returns A message indicating the result of the delete operation.
   * @throws Error if the role is not found, is associated with a user, or if there is an internal server error.
   */
  public async deleteRoleById(req: Request): Promise<any> {
    const db = this.getdb(req);
    const roleId = Number(req.params.id);

    try {
      const roleFactory = new RoleFactory(db);
      const result = await roleFactory.deleteRoleById(roleId);

      if (!result.success) {
        // Handle specific error cases
        if (result.message === RoleMessages.RoleNotFound) {
          throw new Error(RoleMessages.RoleNotFound);
        }
        if (result.message === RoleMessages.RoleAssociatedWithUser) {
          throw new Error(RoleMessages.RoleAssociatedWithUser);
        }
      }

      // Return success response
      return result.message;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }
}

export default new RoleService();
