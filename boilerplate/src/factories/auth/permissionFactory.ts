import PermissionModel, { PermissionUpdate } from '../../models/master/permissionModel';
import { PermissionMessages, ErrorMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';

/**
 * Factory class for managing permissions.
 * Provides methods for creating, retrieving, updating, and deleting permissions.
 */
class PermissionFactory {
  private permissionModel: PermissionModel;

  /**
   * Initializes the PermissionFactory with a specific database name.
   * @param dbName - The name of the database.
   */
  constructor(db: Knex) {
    this.permissionModel = new PermissionModel(db);
  }

  /**
   * Creates a new permission.
   * Checks if the permission already exists before creation.
   * @param permissionData - Data for the new permission.
   * @returns The created permission.
   * @throws Error if the permission already exists or an internal server error occurs.
   */
  public async createPermission(permissionData: any) {
    try {
      const permissionExists = await this.permissionModel.doesPermissionExist(permissionData.permission_name);
      if (permissionExists) {
        throw new Error(PermissionMessages.PermissionAlreadyExists);
      }
      return await this.permissionModel.createPermission(permissionData);
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
   * @returns A list of permissions.
   * @throws Error if an internal server error occurs.
   */
  public async getPermissions() {
    try {
      return await this.permissionModel.getPermissions();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves all permissions along with associated routes.
   * @returns A list of permissions with routes.
   * @throws Error if an internal server error occurs.
   */
  public async getPermissionsWithRoutes() {
    try {
      return await this.permissionModel.getPermissionsWithRoutes();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Retrieves a specific permission by its ID.
   * @param permissionId - The ID of the permission to retrieve.
   * @returns The permission with the specified ID.
   * @throws Error if the permission is not found or an internal server error occurs.
   */
  public async getPermissionById(permissionId: number) {
    try {
      const permission = await this.permissionModel.getPermissionById(permissionId);
      if (!permission) {
        throw new Error(PermissionMessages.PermissionNotFound);
      }
      return permission;
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
   * Updates a specific permission.
   * Checks for associated roles and validates operations before updating.
   * @param permissionId - The ID of the permission to update.
   * @param updateData - The data to update the permission with.
   * @returns The updated permission.
   * @throws Error if the permission is not found, invalid operations are provided, or an internal server error occurs.
   */
  public async updatePermission(permissionId: number, updateData: any) {
    try {
      const roles = await this.permissionModel.getRolesByPermissionId(permissionId);
      if (roles.length > 0) {
        const existingPermission = await this.permissionModel.getPermissionById(permissionId);

        if (!existingPermission) {
          throw new Error(PermissionMessages.PermissionNotFound);
        }

        const validOperations: any = ['read', 'update', 'delete', 'create'];

        // Parse existing and new operations
        const existingOperations = new Set(
          existingPermission.permission_operations
            .replace(/[{}]/g, '') // Remove curly braces if stored like "{read,create}"
            .split(',')
        );

        const newOperations = new Set(updateData.permissionOperations || []);

        // 1. If both are the same, skip update
        const areSameOperations = [...existingOperations].sort().join() === [...newOperations].sort().join();
        if (areSameOperations) {
          return existingPermission;
        }

        // 2. If existing has more operations than the update data, skip update
        if (existingOperations.size > newOperations.size) {
          return existingPermission;
        }

        // 3. Ensure all new operations are valid CRUD operations
        const allValid = [...newOperations].every(op => validOperations.includes(op));
        if (!allValid) {
          throw new Error('Invalid operation in update data');
        }

        // 4. Update if existing has fewer operations than the update data
        if (existingOperations.size < newOperations.size) {
          const updatedPermission = await this.permissionModel.updatePermission(permissionId, {
            permission_operations: Array.from(newOperations),
          });

          if (!updatedPermission) {
            throw new Error(PermissionMessages.PermissionNotFound);
          }

          return updatedPermission;
        }
        return existingPermission;
      } else {
        const isPresent = await this.getPermissionById(permissionId)
        if (!isPresent) {
          throw new Error(PermissionMessages.PermissionNotFound);
        }
        
        const updatedPermission = await this.permissionModel.updatePermission(permissionId, updateData);
        return updatedPermission;
      }
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

  public async updateMultiplePermissions(permissionUpdates: PermissionUpdate[]) {
    try {
      const updatePermissions: PermissionUpdate[] = [];
      
      // Define valid CRUD operations
      const validOperations = ['read', 'create', 'update', 'delete'];
  
      // Iterate over each permission update object
      for (const { permissionId, updateData } of permissionUpdates) {
        // Validate that all permission operations are within the valid CRUD operations
        const isValidOperations = updateData.permissionOperations.every(operation => validOperations.includes(operation));
  
        if (!isValidOperations) {
          throw new Error('Invalid operation detected. Only CRUD operations are allowed.'); // Handle invalid operations
        }
  
        // Directly update the permissions if validation passes
        updatePermissions.push({ permissionId, updateData });
      }
  
      // Proceed with the update for those permissions
      return await this.permissionModel.updateMultiplePermissions(updatePermissions);
    } catch (error: unknown) {
      throw new Error(ErrorMessages.UnknownError); // Generic unknown error
    }
  }
  /**
   * Deletes a specific permission by its ID.
   * @param permissionId - The ID of the permission to delete.
   * @returns A confirmation message.
   * @throws Error if the permission is not found or an internal server error occurs.
   */
  public async deletePermission(permissionId: number) {
    try {
      const deleted = await this.permissionModel.deletePermission(permissionId);
      if (!deleted) {
        throw new Error(PermissionMessages.PermissionNotFound);
      }
      return { message: PermissionMessages.PermissionDeleted };
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
   * Assigns routes to a specific permission.
   * @param permissionId - The ID of the permission to assign routes to.
   * @param routes - List of routes to assign.
   * @returns The updated permission with assigned routes.
   * @throws Error if the permission is not found or an internal server error occurs.
   */
  public async assignRoutesToPermission(permissionId: number, routes: string[]) {
    try {
      const permission = await this.getPermissionById(permissionId);
      if (!permission) {
        throw new Error(PermissionMessages.PermissionNotFound);
      }
      return await this.permissionModel.assignRoutesToPermission(permissionId, routes);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }
}

export default PermissionFactory;
