import { Request } from 'express';
import PermissionFactory from '../../factories/auth/permissionFactory';
import { PermissionMessages, ErrorMessages, DatabaseMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';

/**
 * Service class for handling permission-related business logic.
 */
class PermissionService {
  /**
   * Retrieves the database name from the request object.
   * @param req - The Express request object.
   * @returns The name of the database.
   * @throws Error if the database name is not configured.
   */
  private getDbName(req: Request): Knex {
    const dbName = (req as any).knex;
    if (!dbName) {
      throw new Error(DatabaseMessages.DatabaseNotConfigured);
    }
    return dbName;
  }

  /**
   * Creates a new permission.
   * @param req - The Express request object containing permission details.
   * @returns A promise resolving to the result of the creation operation.
   * @throws Error if the permission already exists or if an internal server error occurs.
   */
  public async createPermission(req: Request) {
    const { permissionName, permissionDescription, permissionOperations, createdBy } = req.body;
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.createPermission({
        permission_name: permissionName,
        permission_description: permissionDescription,
        permission_operations: permissionOperations,
        created_by: createdBy
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionAlreadyExists:
            throw new Error(PermissionMessages.PermissionAlreadyExists);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves all permissions.
   * @param req - The Express request object.
   * @returns A promise resolving to the list of permissions.
   * @throws Error if an internal server error occurs.
   */
  public async getPermissions(req: Request) {
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      const permissions = await permissionFactory.getPermissions();

      // Transform data to the desired format
      const formattedPermissions = permissions!.map((permission: any) => {
        // Remove curly braces and trim any extra whitespace
        const actions = permission.permission_operations
          .replace(/[{}"]/g, '') // Remove curly braces and quotes
          .split(',') // Split by commas
          .map((op: string) => op.trim()) // Trim whitespace
          .filter((op: string) => op.length > 0); // Remove empty entries

        return {
          resource: permission.permission_name, // Assuming permission_name is the resource
          actions: actions,
          id: permission.id
        };
      });

      return formattedPermissions;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves permissions along with their associated routes.
   * @param req - The Express request object.
   * @returns A promise resolving to the list of permissions with routes.
   * @throws Error if an internal server error occurs.
   */
  public async getPermissionsWithRoutes(req: Request) {
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.getPermissionsWithRoutes();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Updates an existing permission.
   * @param req - The Express request object containing the permission ID and update data.
   * @returns A promise resolving to the result of the update operation.
   * @throws Error if the permission is not found or if an internal server error occurs.
   */
  public async updatePermission(req: Request) {
    const { permissionId, updateData } = req.body;
    
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.updatePermission(permissionId, updateData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            throw new Error(PermissionMessages.PermissionNotFound);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Updates multiple permissions.
   * @param req - The Express request object containing an array of permission updates.
   * @returns A promise resolving to the result of the update operation.
   * @throws Error if an internal server error occurs.
   */
  public async updateMultiplePermissions(req: Request) {
    const permissionUpdates = req.body; // Expecting an array of { id, actions }
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.updateMultiplePermissions(permissionUpdates);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Deletes a permission.
   * @param req - The Express request object containing the permission ID.
   * @returns A promise resolving to the result of the delete operation.
   * @throws Error if the permission is not found or if an internal server error occurs.
   */
  public async deletePermission(req: Request) {
    const { permissionId } = req.body;
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.deletePermission(permissionId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            throw new Error(PermissionMessages.PermissionNotFound);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Assigns routes to a permission.
   * @param req - The Express request object containing the permission ID and routes.
   * @returns A promise resolving to the result of the assignment operation.
   * @throws Error if the permission is not found or if an internal server error occurs.
   */
  public async assignRoutesToPermission(req: Request) {
    const { permissionId, routes } = req.body;
    const dbName = this.getDbName(req);

    try {
      const permissionFactory = new PermissionFactory(dbName);
      return await permissionFactory.assignRoutesToPermission(permissionId, routes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            throw new Error(PermissionMessages.PermissionNotFound);
          default:
            throw new Error(ErrorMessages.InternalServerError);
        }
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }
}

export default new PermissionService();
