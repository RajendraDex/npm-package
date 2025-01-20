import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ResponseCodes } from '../../enums/responseCodes';

/**
 * Middleware to sanitize input data from the request.
 * 
 * This middleware recursively removes HTML tags from the request body, query, 
 * and params to prevent XSS attacks or unwanted HTML content in the input data.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to the next middleware
 */
export const sanitizeMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  /**
   * Recursively sanitize input data.
   * 
   * @param input - The data to be sanitized, could be a string, object, or array
   * @returns The sanitized data
   */
  const sanitizeInput = (input: any) => {
    if (typeof input === 'string') {
      // Remove HTML tags from the string input
      return input.replace(/<\/?[^>]+(>|$)/g, ""); 
    } else if (typeof input === 'object' && input !== null) {
      // If the input is an object, recursively sanitize its properties
      Object.keys(input).forEach(key => {
        input[key] = sanitizeInput(input[key]);
      });
    }
    return input; // Return sanitized input
  };

  // Sanitize the body, query, and params of the request
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);

  // Pass control to the next middleware
  next();
};

/**
 * Middleware to validate request data using a Zod schema.
 * 
 * This middleware uses a Zod schema to validate the request body. If the validation fails,
 * it returns a 400 response with the validation errors. If successful, it replaces the request body
 * with the validated data to ensure the input adheres to the schema.
 * 
 * @param schema - The Zod schema to validate against
 * @returns Express middleware function
 */
export const validateMiddleware = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Validate the request body against the provided schema
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      // If validation fails, respond with a 400 error and the validation errors
      return res.status(400).json({
        code: ResponseCodes.BAD_REQUEST,
        message: "Invalid input data",
        errors: validationResult.error.errors,
      });
    }

    // If validation succeeds, replace the request body with the validated data
    req.body = validationResult.data;
    
    // Pass control to the next middleware
    next();
  };
};
