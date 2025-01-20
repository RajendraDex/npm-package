import { Request } from 'express';
import UserFactory from '../../factories/auth/userFactory';
import AuthUtils from '../../helpers/auth/authHelper';
import { ErrorMessages, UserMessages, ValidationMessages } from '../../enums/responseMessages';
class UserService extends AuthUtils{
  /**
   * Handles user login by validating credentials and interacting with the UserFactory.
   * 
   * @param req - The Express request object containing email and password in the body.
   * @returns The result of the login process from UserFactory.
   * @throws Error if email or password is missing, if credentials are invalid, or if an internal server error occurs.
   */
  public async login(req: Request) {
    const { email, password } = req.body; // Extract email and password from the request body
    const db = (req as any).knex; // Retrieve the Knex instance from the request
    const isTenant = (req as any).isTenant; // Extract isTenant flag from the request
    // Validate that both email and password are provided
    if (!email || !password) {
      throw new Error(ValidationMessages.EmailAndPasswordRequired);
    }
    try {
      const userFactory = new UserFactory(db); // Create a UserFactory instance with the Knex instance

      // Attempt to log in with the provided email, password, and tenant flag
      return await userFactory.login(email, password, isTenant);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle known error cases
        if (error.message === UserMessages.UserNotFound) {
          throw new Error(UserMessages.UserNotFound);
        }
        if (error.message === ValidationMessages.InvalidCredentials) {
          throw new Error(ValidationMessages.InvalidCredentials);
        }
        // For other errors, throw a generic internal server error
        throw new Error(ErrorMessages.InternalServerError);
      }
      // For unknown errors, throw a generic unknown error
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Generates a new access token using a refresh token.
   * 
   * @param refreshToken - The refresh token provided by the user.
   * @returns A new access token.
   * @throws Error if the refresh token is invalid or expired.
   */
  public async refreshAccessToken(req: Request) {
    const { refreshToken } = req.body; // Extract refresh token from the request body
    const db = (req as any).knex; // Retrieve the Knex instance from the request
    const isTenant = (req as any).isTenant; // Extract isTenant flag from the request
    if(!refreshToken){
      throw new Error(ValidationMessages.EmailAndPasswordRequired);
    }
    try {
      const userFactory = new UserFactory(db)
      const decoded = this.verifyToken(refreshToken); // Verify the refresh token
      const userId = decoded.id; 
      return await userFactory.refreshAccessToken (userId,isTenant,refreshToken);
    } catch (error) {
      throw new Error(ValidationMessages.InvalidRefreshToken);
    }
  }

  /**
   * Changes the user's password.
   * 
   * @param req - The Express request object containing old and new passwords.
   * @returns A success message if the password change is successful.
   * @throws Error if the old or new password is missing, or if the password change fails.
   */
  public async changePassword(req: Request) {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Extract refresh token from the request body
    const { oldPassword, newPassword } = req.body; // Extract old and new passwords from the request body
    const db = (req as any).knex; // Retrieve the Knex instance from the request
    const isTenant = (req as any).isTenant; // Extract isTenant flag from the request
    const decoded = this.verifyToken(accessToken!); // Verify the refresh token
    const userId = decoded.id; 
    // Validate that both old and new passwords are provided
    if (!oldPassword || !newPassword) {
      throw new Error(ValidationMessages.PasswordChangeRequired);
    }
    try {
      const userFactory = new UserFactory(db); // Create a UserFactory instance with the Knex instance

      // Attempt to change the password with the provided user ID, old password, new password, and tenant flag
      return await userFactory.changePassword(userId, oldPassword, newPassword, isTenant);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle known error cases
        if (error.message === UserMessages.UserNotFound) {
          throw new Error(UserMessages.UserNotFound);
        }
        if (error.message === ValidationMessages.InvalidCredentials) {
          throw new Error(ValidationMessages.InvalidOldPassword);
        }
        // For other errors, throw a generic internal server error
        throw new Error(ErrorMessages.InternalServerError);
      }
      // For unknown errors, throw a generic unknown error
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  public async logout(req: Request) {
    try {
      const accessToken = req.headers.authorization?.split(' ')[1]; // Extract refresh token from the request body
      const db = (req as any).knex; // Retrieve the Knex instance from the request
      const isTenant = (req as any).isTenant; // Extract isTenant flag from the request
      const decoded = this.verifyToken(accessToken!); // Verify the refresh token
      const userId = decoded.id;
      const sessionId = decoded.gId;
      const userFactory = new UserFactory(db);
      return await userFactory.logout(userId,sessionId, isTenant);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === UserMessages.AlreadyLoggedOut) {
          throw new Error(UserMessages.AlreadyLoggedOut);
        }
      }
      throw new Error(ErrorMessages.InternalServerError);
    }
  }
}
export default new UserService();
