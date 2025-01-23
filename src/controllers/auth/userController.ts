import { Request, Response } from 'express';
import UserService from '../../services/auth/userService';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';
import { ErrorMessages, UserMessages, ValidationMessages } from '../../enums/responseMessages';

class UserController {
  // Controller method for handling user login
  public async login(req: Request, res: Response) {
    try {
      // Call the UserService to perform the login operation with the provided request data
      const result = await UserService.login(req);
      // If login is successful, respond with a 200 status code and the result
      res.status(200).json(handleResponse(result, UserMessages.LoginSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle case where the user is not found, respond with a 404 status code
        if (error.message === UserMessages.UserNotFound) {
          res.status(404).json(handleResponse(null, UserMessages.UserNotFound, ResponseCodes.NOT_FOUND));
        } 
        // Handle case where the credentials are invalid, respond with a 401 status code
        else if (error.message === ValidationMessages.InvalidCredentials) {
          res.status(401).json(handleResponse(null, ValidationMessages.InvalidCredentials, ResponseCodes.UNAUTHORIZED));
        } 
        // Handle any other known errors with a 500 status code
        else {
          res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        // Handle any unknown errors with a 500 status code
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method for refreshing access token
  public async refreshAccessToken(req: Request, res: Response) {
    try {
      const result = await UserService.refreshAccessToken(req);
      res.status(200).json(handleResponse(result, UserMessages.RefreshTokenSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error messages for refresh token
        if (error.message === ValidationMessages.InvalidRefreshToken) {
          res.status(401).json(handleResponse(null, ValidationMessages.InvalidRefreshToken, ResponseCodes.UNAUTHORIZED));
        } else {
          res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method for changing user password
  public async changePassword(req: Request, res: Response) {
    try {
      // Call the UserService to perform the password change operation with the provided request data
      const result = await UserService.changePassword(req);
      // If password change is successful, respond with a 200 status code and the result
      res.status(200).json(handleResponse(null, UserMessages.PasswordChangeSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle case where the user is not found, respond with a 404 status code
        if (error.message === UserMessages.UserNotFound) {
          res.status(404).json(handleResponse(null, UserMessages.UserNotFound, ResponseCodes.NOT_FOUND));
        } 
        // Handle case where the credentials are invalid, respond with a 401 status code
        else if (error.message === ValidationMessages.InvalidOldPassword) {
          res.status(401).json(handleResponse(null, ValidationMessages.InvalidOldPassword, ResponseCodes.UNAUTHORIZED));
        } 
        // Handle any other known errors with a 500 status code
        else {
          res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        // Handle any unknown errors with a 500 status code
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method for logging out
  public async logout(req: Request, res: Response) {
    try {
      await UserService.logout(req);
      res.status(200).json(handleResponse(null, UserMessages.LogoutSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === UserMessages.AlreadyLoggedOut) {
          res.status(400).json(handleResponse(null, UserMessages.AlreadyLoggedOut, ResponseCodes.BAD_REQUEST));
        } else {
          res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }
}

export default new UserController();
