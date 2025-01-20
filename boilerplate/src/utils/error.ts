// PROTOTYPE PATTERN

/**
 * Custom error class for handling application-specific errors.
 * 
 * Extends the built-in Error class to include additional properties:
 * - statusCode: HTTP status code associated with the error.
 * - isOperational: Indicates whether the error is operational (i.e., a known issue) or programmer error (i.e., unexpected).
 */
export class AppError extends Error {
  public readonly statusCode: number; // HTTP status code associated with the error
  public readonly isOperational: boolean; // Indicates if the error is operational (true) or programmer error (false)

  /**
   * Constructs a new AppError instance.
   * 
   * @param message - The error message to be displayed.
   * @param statusCode - The HTTP status code associated with the error.
   * @param isOperational - Indicates if the error is operational (default is true).
   * @param stack - The stack trace of the error (optional).
   */
  constructor(message: string, statusCode: number, isOperational = true, stack = '') {
    super(message); // Call the Error constructor with the error message
    Object.setPrototypeOf(this, new.target.prototype); // Set the prototype chain to ensure instanceof checks work
    this.statusCode = statusCode; // Set the status code
    this.isOperational = isOperational; // Set if the error is operational
    if (stack) {
      this.stack = stack; // Set the stack trace if provided
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace if not provided
    }
  }
}

/**
* Formats a response object.
* 
* @param data - The data to include in the response.
* @param message - The message to include in the response (default is 'Success').
* @param code - The HTTP status code for the response (default is 200).
* @returns An object containing the code, message, and data.
*/
export const handleResponse = (data: any, message = 'Success', code = 200) => ({
  code, // HTTP status code
  message, // Response message
  data, // Response data
});
