import UserService from '../../../src/services/auth/userService';
import UserFactory from '../../../src/factories/auth/userFactory';
import { Request } from 'express';
import { ValidationMessages, UserMessages } from '../../../src/enums/responseMessages';
import jwt from 'jsonwebtoken';

// Mock UserFactory to isolate UserService tests from the actual factory implementation
jest.mock('../../../src/factories/auth/userFactory');

// Helper function to generate a valid JWT for testing
const generateValidJwt = (userId: string) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET || 'your_secret'; // Ensure you have a default or configured secret
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

/**
 * Helper function to create a mock Request object
 * @param body - The request body
 * @param isTenant - Boolean indicating if the request is for a tenant
 * @param headers - Optional headers for the request
 * @returns - Mocked Request object
 */
const mockRequest = (body: any, isTenant: boolean, headers: any = {}) => ({
  body,
  headers: {
    authorization: `Bearer ${generateValidJwt('user_uuid')}`,
    ...headers,
  },
  ...(isTenant ? { isTenant: true } : { isTenant: false }),
} as unknown as Request);

// Clear all mocks before each test to ensure a clean state
beforeEach(() => {
  jest.clearAllMocks();
});

/**
 * Test case for successful login when UserFactory returns a result
 */
it('should return login result from UserFactory', async () => {
  // Arrange: Set up the request and mock the UserFactory login method
  const req = mockRequest({ email: 'test@example.com', password: 'password' }, false);
  const result = {
    userId: 'user_uuid',
    userName: 'Test User',
    tokens: { accessToken: 'token', refreshToken: 'refreshToken' },
  };

  // Mock UserFactory.login to resolve with the predefined result
  (UserFactory.prototype.login as jest.Mock).mockResolvedValue(result);

  // Act: Call the login method of UserService
  const loginResult = await UserService.login(req);

  // Assert: Verify that the result matches the expected outcome
  expect(loginResult).toEqual(result); // Check if the returned result matches the expected result
});

/**
 * Test case for missing email or password in the request
 */
it('should throw error if email or password is missing', async () => {
  // Arrange: Set up the request with missing email and password

  const req = mockRequest({ email: '', password: '' }, false);

  // Act & Assert: Verify that the appropriate error is thrown
  await expect(UserService.login(req)).rejects.toThrowError(ValidationMessages.EmailAndPasswordRequired);
  // Check if the error thrown matches the expected validation message for missing email or password
});

/**
 * Test case for handling errors from UserFactory
 */
it('should handle errors from UserFactory', async () => {
  // Arrange: Set up the request and mock UserFactory login method to reject with an error
  const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' }, false);
  (UserFactory.prototype.login as jest.Mock).mockRejectedValue(new Error(UserMessages.UserNotFound));

  // Act & Assert: Verify that the appropriate error is thrown
  await expect(UserService.login(req)).rejects.toThrowError(UserMessages.UserNotFound);
  // Check if the error thrown matches the expected user not found message
});

/**
 * Test case for successful password change
 */
it('should successfully change the user password', async () => {
  // Arrange: Set up the request with a valid JWT and mock the UserFactory changePassword method
  const req = mockRequest(
    { oldPassword: 'oldpassword', newPassword: 'newpassword' },
    false
  );
  const successMessage = 'Password changed successfully';

  // Mock UserFactory.changePassword to resolve with the success message
  (UserFactory.prototype.changePassword as jest.Mock).mockResolvedValue(successMessage);

  // Act: Call the changePassword method of UserService
  const result = await UserService.changePassword(req);

  // Assert: Verify that the result matches the expected success message
  expect(result).toEqual(successMessage);
});

/**
 * Test case for missing old or new password in the request
 */
it('should throw error if old or new password is missing', async () => {
  // Arrange: Set up the request with missing old and new passwords and a valid JWT
  const req = mockRequest(
    { oldPassword: '', newPassword: '' },
    false
  );

  // Act & Assert: Verify that the appropriate error is thrown
  await expect(UserService.changePassword(req)).rejects.toThrowError(ValidationMessages.PasswordChangeRequired);
});

/**
 * Test case for invalid or expired refresh token
 */
it('should throw error if refresh token is invalid or expired', async () => {
  // Arrange: Set up the request with an invalid refresh token
  const req = mockRequest({ refreshToken: 'invalid_refresh_token' }, false);

  // Mock UserFactory.refreshAccessToken to throw an error for invalid token
  (UserFactory.prototype.refreshAccessToken as jest.Mock).mockRejectedValue(new Error(ValidationMessages.InvalidRefreshToken));

  // Act & Assert: Verify that the appropriate error is thrown
  await expect(UserService.refreshAccessToken(req)).rejects.toThrowError(ValidationMessages.InvalidRefreshToken);
});
