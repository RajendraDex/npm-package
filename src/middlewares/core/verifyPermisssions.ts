import { Request, Response, NextFunction } from 'express';
import RoleModel from '../../models/master/roleModel';
import PermissionModel from '../../models/master/permissionModel';
import DatabaseUtils from '../../models/generelisedModel';
import Auth from '../../helpers/auth/authHelper'; // Import the concrete class for authentication
import { handleResponse } from '../../utils/error';
import { ErrorMessages, UserMessages, ValidationMessages } from '../../enums/responseMessages';
import { ResponseCodes } from '../../enums/responseCodes';
import { defaultKnex, getKnexWithConfig } from '../../db/knexfile';
import { logger } from '../../utils/logger';

// Create an instance of the Auth helper class for token verification
const auth = new Auth();

/**
 * Middleware to verify user role permissions.
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 */
export const verifyRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      logger.warn('Unauthorized access attempt: No token provided');
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }

    let decodedToken: any;
    try {
      decodedToken = auth.verifyToken(token);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Token verification failed: ${errorMessage}`);
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }

    const userUUID = decodedToken.id;
    const originType = Number(decodedToken['x-request-origin-type'])
    const isTenant = (req as any).isTenant;
    const tenantDbConfig = (req as any).tenantDbConfig;
    let knexInstance = (req as any).knex;
    let user: any;
   

    if (originType === 1) {
      const dbUtils = new DatabaseUtils(defaultKnex);
      user = await dbUtils.select('saas_admin', { admin_uuid: userUUID }, ["id"]).then(users => users[0]);
      // If user is valid, switch back to tenant DB if tenant exists
      if (user && tenantDbConfig) {
        knexInstance = getKnexWithConfig(tenantDbConfig);
        (req as any).knex = knexInstance;
      }
      if (user) {
        (req as any).userInfo = { id: user.id, type: 2 }; // Type 2 for non-tenant users
      }
    } else if (isTenant && originType === 2) {
      // Use tenant DB for validation
      //  const tenantStaffModel = new TenantStaffModel(knexInstance);
      //  user = await tenantStaffModel.findByUUID(userUUID);
      const dbUtils = new DatabaseUtils(knexInstance);
      user = await dbUtils.select('tenant_staff', { staff_uuid: userUUID }, ["id"]).then(users => users[0])
      if (user) {
        (req as any).userInfo = { id: user.id, type: 1 }; // Type 1 for tenant users
      }
    }

    if (!user) {
      logger.warn(`User not found for UUID: ${userUUID}`);
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }

    const userId = user.id;
    const roleModel = new RoleModel(knexInstance);
    const permissionModel = new PermissionModel(knexInstance);

    const userRoles = await roleModel.getRolesByUserId(userId, isTenant);
    if (userRoles.length > 0) {
      req.role = userRoles[0].role_name;
    }
    if (userRoles.some((role) => role.role_name === 'Super Admin' || role.role_name === 'Admin' || role.role_name === 'Super')) {
      logger.info(`Super Admin or Admin access granted`);
      return next();
    }

    const userPermissions = await roleModel.getPermissionsByUserId(userId, isTenant);
    if (!userPermissions.length) {
      logger.warn(`No permissions found for user: ${userId}`);
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }
    const permissions = userPermissions.flatMap((permission) => {
      return permission.role_permissions.map((p: { permission_id: number, permission_operations: string[] }) => ({
        permission_id: p.permission_id,
        permission_operations: p.permission_operations,
      }));
    });

    const requestedRoute = req.baseUrl;
    let permissionObject: any = null;

    for (let permission of permissions) {
      const permissionRoutes = await permissionModel.getRoutesByPermissionId(permission.permission_id);
      if (permissionRoutes.some((route) => route.route_endpoint === '/all')) {
        return next();
      }

      if (permissionRoutes.some((route) => route.route_endpoint === requestedRoute)) {
        permissionObject = {
          permission_id: permission.permission_id,
          permission_routes: permissionRoutes.map((route) => route.route_endpoint),
          permission_operations: permission.permission_operations,
        };
        break;
      }
    }

    if (!permissionObject) {
      logger.warn(`No matching permission found for route: ${requestedRoute}, user: ${userId}`);
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }

    const requestedMethod = req.method.toLowerCase();
    const operationMapping: { [key: string]: string } = {
      post: 'create',
      get: 'read',
      put: 'update',
      delete: 'delete',
    };

    const requiredOperation = operationMapping[requestedMethod];

    if (!requiredOperation || !permissionObject.permission_operations.includes(requiredOperation)) {
      logger.warn(`Unauthorized operation: ${requestedMethod} for user: ${userId}, route: ${requestedRoute}`);
      return res.status(ResponseCodes.UNAUTHORIZED).json(
        handleResponse(null, ValidationMessages.Unauthorized, ResponseCodes.UNAUTHORIZED)
      );
    }

    logger.info(`Access granted for user: ${userId}, route: ${requestedRoute}, method: ${requestedMethod}`);
    next();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    logger.error(`Error in verifyRolePermissions: ${errorMessage}`, { stack: errorStack });
    return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
      handleResponse(null, ErrorMessages.InvalidRequest , ResponseCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
