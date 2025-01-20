import { Request, Response } from 'express';
import PermissionService from '../../services/auth/permissionService';
import { PermissionMessages, ErrorMessages } from '../../enums/responseMessages';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';

/**
 * Handles CRUD operations for permissions.
 */
class PermissionController {
  /**
   * Creates a new permission.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the status and result of the creation operation.
   */
  public async createPermission(req: Request, res: Response) {
    try {
      const result = await PermissionService.createPermission(req);
      return res.status(ResponseCodes.CREATED).json(handleResponse(result, PermissionMessages.PermissionCreated, ResponseCodes.CREATED));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionAlreadyExists:
            return res.status(ResponseCodes.FORBIDDEN).json(handleResponse(null, PermissionMessages.PermissionAlreadyExists, ResponseCodes.FORBIDDEN));
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Retrieves all permissions.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the list of permissions.
   */
  public async getPermissions(req: Request, res: Response) {
    try {
      const result = await PermissionService.getPermissions(req);
      return res.status(ResponseCodes.OK).json(handleResponse(result, PermissionMessages.PermissionsFetched, ResponseCodes.OK));
    } catch (error: unknown) {
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Updates an existing permission.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the status and result of the update operation.
   */
  public async updatePermission(req: Request, res: Response) {
    try {
      const result = await PermissionService.updatePermission(req);
      return res.status(ResponseCodes.OK).json(handleResponse(null, PermissionMessages.PermissionUpdated, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, PermissionMessages.PermissionNotFound, ResponseCodes.NOT_FOUND));
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Updates multiple permissions.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the status and result of the update operation.
   */
  public async updateMultiplePermissions(req: Request, res: Response) {
    try {
      const result = await PermissionService.updateMultiplePermissions(req);
      return res.status(ResponseCodes.OK).json(handleResponse(null, PermissionMessages.PermissionUpdated, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, PermissionMessages.PermissionNotFound, ResponseCodes.NOT_FOUND));
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Deletes a permission.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the status and result of the delete operation.
   */
  public async deletePermission(req: Request, res: Response) {
    try {
      const result = await PermissionService.deletePermission(req);
      return res.status(ResponseCodes.OK).json(handleResponse(result, PermissionMessages.PermissionDeleted, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, PermissionMessages.PermissionNotFound, ResponseCodes.NOT_FOUND));
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }

  /**
   * Assigns routes to a permission.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A JSON response with the status and result of the assignment operation.
   */
  public async assignRoutesToPermission(req: Request, res: Response) {
    try {
      const result = await PermissionService.assignRoutesToPermission(req);
      return res.status(ResponseCodes.OK).json(handleResponse(result, PermissionMessages.RoutesAssigned, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        switch (error.message) {
          case PermissionMessages.PermissionNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, PermissionMessages.PermissionNotFound, ResponseCodes.NOT_FOUND));
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
  }
}

export default new PermissionController();
