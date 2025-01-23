import { Request, Response } from 'express';
import RoleService from '../../services/auth/roleService';
import { RoleMessages, ErrorMessages } from '../../enums/responseMessages';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';

class RoleController {
  // Controller method to create a new role
  public async createRole(req: Request, res: Response) {
    try {
      // Call RoleService to handle the role creation
      await RoleService.createRole(req);

      // Respond with a 201 Created status and a success message
      return res.status(ResponseCodes.CREATED).json(
        handleResponse(null, RoleMessages.RoleCreated, ResponseCodes.CREATED)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages with corresponding HTTP status codes
        switch (error.message) {
          case RoleMessages.RoleAlreadyExists:
            return res.status(ResponseCodes.FORBIDDEN).json(
              handleResponse(null, RoleMessages.RoleAlreadyExists, ResponseCodes.FORBIDDEN)
            );
          case RoleMessages.RoleNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(
              handleResponse(null, RoleMessages.RoleNotFound, ResponseCodes.NOT_FOUND)
            );
          case RoleMessages.RoleAssociatedWithUser:
            return res.status(ResponseCodes.CONFLICT).json(
              handleResponse(null, RoleMessages.RoleAssociatedWithUser, ResponseCodes.CONFLICT)
            );
          case ErrorMessages.InternalServerError:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
        }
      }
      // Handle any unknown errors with a 500 Internal Server Error status
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
        handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  // Controller method to update an existing role
  public async updateRole(req: Request, res: Response) {
    try {
      // Call RoleService to handle the role update
      await RoleService.updateRole(req);

      // Respond with a 200 OK status and a success message
      return res.status(ResponseCodes.OK).json(
        handleResponse(null, RoleMessages.RoleUpdated, ResponseCodes.OK)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages with corresponding HTTP status codes
        switch (error.message) {
          case RoleMessages.RoleNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(
              handleResponse(null, RoleMessages.RoleNotFound, ResponseCodes.NOT_FOUND)
            );
          case ErrorMessages.InternalServerError:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
        }
      }
      // Handle any unknown errors with a 500 Internal Server Error status
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
        handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  // Controller method to fetch all roles
  public async getRoles(req: Request, res: Response) {
    try {
      // Call RoleService to fetch the list of roles
      const result = await RoleService.getRoles(req);

      // Respond with a 200 OK status and the list of roles
      return res.status(ResponseCodes.OK).json(
        handleResponse(result, RoleMessages.RolesFetched, ResponseCodes.OK)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages with corresponding HTTP status codes
        switch (error.message) {
          case ErrorMessages.InternalServerError:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
        }
      }
      // Handle any unknown errors with a 500 Internal Server Error status
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
        handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  // Controller method to fetch a single role by its ID
  public async getRoleById(req: Request, res: Response) {
    try {
      // Call RoleService to fetch the role by its ID
      const result = await RoleService.getRoleById(req);

      // Respond with a 200 OK status and the role details
      return res.status(ResponseCodes.OK).json(
        handleResponse(result, RoleMessages.RoleFetched, ResponseCodes.OK)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages with corresponding HTTP status codes
        switch (error.message) {
          case RoleMessages.RoleNotFound:
            return res.status(ResponseCodes.NOT_FOUND).json(
              handleResponse(null, RoleMessages.RoleNotFound, ResponseCodes.NOT_FOUND)
            );
          case ErrorMessages.InternalServerError:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
        }
      }
      // Handle any unknown errors with a 500 Internal Server Error status
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
        handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }

  // Controller method to delete a role by its ID
  public async deleteRoleById(req: Request, res: Response) {
    try {
      // Call RoleService to delete the role by its ID
      const result = await RoleService.deleteRoleById(req);

      // Respond based on the result of the delete operation
      if (result === RoleMessages.RoleNotFound) {
        return res.status(ResponseCodes.NO_CONTENT).json(
          handleResponse(null, RoleMessages.RoleNotFound, ResponseCodes.NO_CONTENT)
        );
      }

      return res.status(ResponseCodes.OK).json(
        handleResponse(null, result, ResponseCodes.OK)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages with corresponding HTTP status codes
        switch (error.message) {
          case RoleMessages.RoleAssociatedWithUser:
            return res.status(ResponseCodes.CONFLICT).json(
              handleResponse(null, RoleMessages.RoleAssociatedWithUser, ResponseCodes.CONFLICT)
            );
          case RoleMessages.RoleNotFound:
            return res.status(ResponseCodes.NO_CONTENT).json(
              handleResponse(null, RoleMessages.RoleNotFound, ResponseCodes.NO_CONTENT)
            );
          case ErrorMessages.InternalServerError:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
          default:
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
              handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
            );
        }
      }
      // Handle any unknown errors with a 500 Internal Server Error status
      return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(
        handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }
}

export default new RoleController();
