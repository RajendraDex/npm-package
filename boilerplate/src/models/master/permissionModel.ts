import { Knex } from 'knex';

interface UpdateData {
  permissionOperations: string[];
}

export interface PermissionUpdate {
  permissionId: number;
  updateData: UpdateData;
}

class PermissionModel {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  /**
   * Retrieve permissions by their IDs.
   * @param ids - Array of permission IDs to retrieve.
   * @returns An array of permissions matching the IDs.
   */
  public async getPermissionsByIds(ids: number[]): Promise<any[]> {
    return this.db('permission_master')
      .select('*')
      .whereIn('id', ids);
  }
  
  /**
   * Create a new permission.
   * @param permissionData - Data for the new permission.
   * @returns The newly created permission.
   * @throws Error if the creation fails.
   */
  public async createPermission(permissionData: any) {
    try {
      return await this.db('permission_master').insert(permissionData).returning('*');
    } catch (error) {
      throw new Error(`PermissionModel createPermission error: ${error}`);
    }
  }

  /**
   * Check if a permission with the given name already exists.
   * @param permissionName - Name of the permission to check.
   * @returns Boolean indicating whether the permission exists.
   * @throws Error if the check fails.
   */
  public async doesPermissionExist(permissionName: string) {
    try {
      const existingPermission = await this.db('permission_master')
        .where('permission_name', permissionName)
        .first();
      return !!existingPermission;
    } catch (error) {
      throw new Error(`PermissionModel doesPermissionExist error: ${error}`);
    }
  }

  /**
   * Retrieve all permissions.
   * @returns An array of all permissions.
   * @throws Error if the retrieval fails.
   */
  public async getPermissions() {
    try {
      return await this.db('permission_master').select('*');
    } catch (error) {
      throw new Error(`PermissionModel getPermissions error: ${error}`);
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
      throw new Error(`PermissionModel getPermissionById error: ${error}`);
    }
  }

  /**
   * Retrieve all routes associated with a specific permission ID.
   * @param permissionId - ID of the permission.
   * @returns An array of route endpoints associated with the permission.
   * @throws Error if the retrieval fails.
   */
  public async getRoutesByPermissionId(permissionId: number) {
    try {
      return await this.db('permission_routes_master')
        .where('permission_id', permissionId)
        .select('route_endpoint');
    } catch (error) {
      throw new Error(`PermissionModel getRoutesByPermissionId error: ${error}`);
    }
  }

  /**
   * Assign routes to a specific permission.
   * @param permissionId - ID of the permission.
   * @param routes - Array of route endpoints to assign.
   * @returns The inserted route records.
   * @throws Error if the assignment fails.
   */
  public async assignRoutesToPermission(permissionId: number, routes: string[]) {
    try {
      const insertData = routes.map(route => ({
        permission_id: permissionId,
        route_endpoint: route,
      }));

      return await this.db('permission_routes_master').insert(insertData).returning('*');
    } catch (error) {
      throw new Error(`PermissionModel assignRoutesToPermission error: ${error}`);
    }
  }

  /**
   * Update a permission's data.
   * @param permissionId - ID of the permission to update.
   * @param updateData - Data to update the permission with.
   * @returns The updated permission.
   * @throws Error if the update fails.
   */
  public async updatePermission(permissionId: number, updateData: any) {
    try {
      return await this.db('permission_master')
        .where('id', permissionId)
        .update({
          permission_operations: updateData.permissionOperations,
        })
        .returning('*');
    } catch (error) {
      throw new Error(`PermissionModel updatePermission error: ${error}`);
    }
  }

  /**
   * Update multiple permissions in a transaction.
   * @param permissionUpdates - Array of permission updates.
   * @returns An array of updated permissions.
   * @throws Error if the transaction fails.
   */
  public async updateMultiplePermissions(permissionUpdates: PermissionUpdate[]) {
    try {
      return await this.db.transaction(async trx => {
        const updatePromises = permissionUpdates.map(({ permissionId, updateData }) => {
          const { permissionOperations } = updateData;

          if (!permissionOperations || !Array.isArray(permissionOperations)) {
            throw new Error(`Invalid permissionOperations for permissionId ${permissionId}`);
          }

          const operations = `{${permissionOperations.join(',')}}`; // Convert array to string

          return trx('permission_master')
            .where('id', permissionId)
            .update({ permission_operations: operations })
            .returning('*');
        });

        const results = await Promise.all(updatePromises);
        return results.flat(); // Flatten the array of arrays into a single array
      });
    } catch (error) {
      throw new Error(`PermissionModel updateMultiplePermissions error: ${error}`);
    }
  }

  /**
   * Retrieve roles associated with a specific permission ID.
   * @param permissionId - ID of the permission.
   * @returns An array of roles associated with the permission.
   * @throws Error if the retrieval fails.
   */
  public async getRolesByPermissionId(permissionId: number): Promise<any[]> {
    try {
      // Use Knex's raw method for the complex query while integrating it into Knex's query builder
      const roles = await this.db
        .select('*')
        .from('roles')
        .whereRaw(
          `EXISTS (
            SELECT 1
            FROM json_array_elements(role_permissions) AS elem
            WHERE (elem->>'permission_id')::int = ?
          )`,
          [permissionId]
        );

      return roles;
    } catch (error) {
      console.error('Error querying roles by permission ID:', error);
      throw error;
    }
  }

  /**
   * Delete a permission by its ID.
   * @param permissionId - ID of the permission to delete.
   * @returns The number of rows affected (should be 1 if successful).
   * @throws Error if the deletion fails.
   */
  public async deletePermission(permissionId: number) {
    try {
      return await this.db('permission_master')
        .where('id', permissionId)
        .del();
    } catch (error) {
      throw new Error(`PermissionModel deletePermission error: ${error}`);
    }
  }

  /**
   * Delete routes associated with a specific permission ID.
   * @param permissionId - ID of the permission.
   * @returns The number of rows affected (should be the number of routes deleted).
   * @throws Error if the deletion fails.
   */
  public async deleteRoutesByPermissionId(permissionId: number) {
    try {
      return await this.db('permission_routes_master')
        .where('permission_id', permissionId)
        .del();
    } catch (error) {
      throw new Error(`PermissionModel deleteRoutesByPermissionId error: ${error}`);
    }
  }

  /**
   * Retrieve permissions along with their associated routes.
   * @returns An array of permissions with their routes in the desired format.
   * @throws Error if the retrieval fails.
   */
  public async getPermissionsWithRoutes() {
    try {
      // Fetch permissions
      const permissions = await this.db('permission_master').select('id', 'permission_name', 'permission_operations');

      // Fetch routes associated with each permission
      const permissionIds = permissions.map(p => p.id);
      const routes = await this.db('permission_routes_master')
        .whereIn('permission_id', permissionIds)
        .select('permission_id', 'route_endpoint');

      // Transform data into desired format
      const permissionsWithRoutes = permissions.map(permission => {
        const associatedRoutes = routes
          .filter(route => route.permission_id === permission.id)
          .map(route => route.route_endpoint);
        
        return {
          resource: permission.permission_name,
          actions: this.getActionsFromEnum(permission.permission_operations),
          id: permission.id.toString(),
        };
      });

      return permissionsWithRoutes;
    } catch (error) {
      throw new Error(`PermissionModel getPermissionsWithRoutes error: ${error}`);
    }
  }

  /**
   * Convert a string representation of operations to an array of actions.
   * @param operations - String representation of operations.
   * @returns An array of action strings.
   */
  private getActionsFromEnum(operations: string): string[] {
    return operations.replace(/[{}"]/g, '').split(',').map(action => action.trim());
  }
}

export default PermissionModel;
