import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET!;
import { v4 as uuidv4 } from 'uuid';
/**
 * Base class for authentication utilities.
 * Provides methods for hashing passwords, generating tokens,
 * and verifying tokens.
 */
abstract class AuthUtils {
  /**
   * Hashes a plaintext password using bcrypt.
   * @param password - The plaintext password to hash.
   * @returns The hashed password.
   */
  protected async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plaintext password with a hashed password.
   * 
   * @param password - The plaintext password to compare.
   * @param hashedPassword - The hashed password to compare against.
   * @returns True if the passwords match, false otherwise.
   */
  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
     * Generates a JSON Web Token (JWT) for a user.
     * 
     * @param payload - The payload to encode in the token.
     * @param expiresIn - The expiration time for the token in seconds.
     * @returns The generated JWT.
     */
  public generateToken(payload: object, expiresIn: number): string {
    return jwt.sign(payload, jwtSecret, { expiresIn });
  }

  /**
   * Verifies a JSON Web Token (JWT) and returns the decoded payload.
   * 
   * @param token - The JWT to verify.
   * @returns The decoded payload if the token is valid.
   */
  verifyToken(token: string): any {
    return jwt.verify(token, jwtSecret);
  }
  /**
  * Generates a unique UUID.
  * 
  * @returns A unique UUID string.
  */
  protected generateUUID(): string {
    return uuidv4();
  }
}

/**
 * Concrete class extending AuthUtils for token operations.
 */
class Auth extends AuthUtils { }

export default Auth;
