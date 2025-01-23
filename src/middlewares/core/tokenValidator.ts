import { Request, Response, NextFunction } from 'express';
import Auth from '../../helpers/auth/authHelper';


// Create an instance of Auth
const auth = new Auth();

/**
 * Middleware to validate the JWT token in the request headers.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 * @returns If the token is valid, the request is allowed to proceed to the next middleware or resolver.
 *          If the token is missing, expired, or invalid, an unauthorized response is returned.
 */
export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // If the token is not present, return an unauthorized response
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: 'Unauthorized',
        data: null,
      });
    }

    // Verify the token
    auth.verifyToken(token);

    // Proceed to the next middleware or resolver
    next();
  } catch (error) {
    // If token verification fails, return an unauthorized response
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized',
      data: null,
    });
  }
};
