import { z } from 'zod';
import { AuthErrors } from '../../enums/errorMessages';

/**
 * Schema for validating login credentials.
 * 
 * This schema ensures that:
 * - `email` is a valid email address.
 * - `password` is a string with a minimum length of 8 characters.
 * 
 * The schema is used to validate user input during the login process,
 * ensuring that the email and password meet the required format and constraints.
 */
export const loginSchema = z.object({
  email: z.string().email(AuthErrors.InvalidEmail), // Validates that the input is a correctly formatted email address
  password: z.string().min(8, AuthErrors.InvalidPassword), // Validates that the password is at least 8 characters long
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, AuthErrors.InvalidPassword),
  newPassword: z.string().min(8, AuthErrors.InvalidPassword),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, AuthErrors.InvalidRefreshToken),
});
