import { Request, Response } from 'express';
import UserController from '../../../src/controllers/auth/userController';
import UserService from '../../../src/services/auth/userService';
import { handleResponse } from '../../../src/utils/error';
import { ResponseCodes } from '../../../src/enums/responseCodes';
import { UserMessages, ValidationMessages } from '../../../src/enums/responseMessages';

// Mock UserService to isolate the controller tests from the actual service implementation
jest.mock('../../../src/services/auth/userService');

describe('UserController', () => {

  /**
   * Helper function to create a mock Request object
   * @param body - The request body
   * @param isTenant - Boolean indicating if the request is for a tenant
   * @returns - Mocked Request object
   */
  const mockRequest = (body: any, isTenant: boolean) => ({
    body,
    ...(isTenant ? { isTenant: true } : { isTenant: false }),
  } as unknown as Request);

  /**
   * Helper function to create a mock Response object
   * @returns - Mocked Response object with stubbed status and json methods
   */
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res); // Mock status method to return the response object itself
    res.json = jest.fn().mockReturnValue(res); // Mock json method to return the response object itself
    return res;
  };

  // Clear all mocks before each test to ensure clean test environment
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test case for successful login
   */
  it('should login successfully and return 200', async () => {
    // Arrange: Set up the request and response objects
    const req = mockRequest({ email: 'test@example.com', password: 'password' }, false);
    const res = mockResponse();
    
    // Define the expected result from UserService.login
    const result = {
      userId: '1',
      userName: 'Test User',
      tokens: { accessToken: 'token', refreshToken: 'refreshToken' },
    };

    // Mock UserService.login to resolve with the predefined result
    (UserService.login as jest.Mock).mockResolvedValue(result);

    // Act: Call the login method of UserController
    await UserController.login(req, res);

    // Assert: Verify the response status and payload
    expect(res.status).toHaveBeenCalledWith(200); // Check if status 200 was set
    expect(res.json).toHaveBeenCalledWith(handleResponse(result, UserMessages.LoginSuccessful, ResponseCodes.OK));
    // Check if json response matches the expected structure
  });

  /**
   * Test case for user not found scenario
   */
  it('should return 404 for user not found', async () => {
    // Arrange: Set up the request and response objects
    const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' }, false);
    const res = mockResponse();
    
    // Mock UserService.login to reject with a user not found error
    (UserService.login as jest.Mock).mockRejectedValue(new Error(UserMessages.UserNotFound));

    // Act: Call the login method of UserController
    await UserController.login(req, res);

    // Assert: Verify the response status and payload
    expect(res.status).toHaveBeenCalledWith(404); // Check if status 404 was set
    expect(res.json).toHaveBeenCalledWith(handleResponse(null, UserMessages.UserNotFound, ResponseCodes.NOT_FOUND));
    // Check if json response matches the expected structure
  });

  /**
   * Test case for invalid credentials scenario
   */
  it('should return 401 for invalid credentials', async () => {
    // Arrange: Set up the request and response objects
    const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' }, false);
    const res = mockResponse();
    
    // Mock UserService.login to reject with an invalid credentials error
    (UserService.login as jest.Mock).mockRejectedValue(new Error(ValidationMessages.InvalidCredentials));

    // Act: Call the login method of UserController
    await UserController.login(req, res);

    // Assert: Verify the response status and payload
    expect(res.status).toHaveBeenCalledWith(401); // Check if status 401 was set
    expect(res.json).toHaveBeenCalledWith(handleResponse(null, ValidationMessages.InvalidCredentials, ResponseCodes.UNAUTHORIZED));
    // Check if json response matches the expected structure
  });

  /**
   * Test case for successful password change
   */
  it('should change password successfully and return 200', async () => {
    // Arrange: Set up the request and response objects
    const req = mockRequest({ oldPassword: 'oldpassword', newPassword: 'newpassword' }, false);
    const res = mockResponse();

    // Mock UserService.changePassword to resolve without errors
    (UserService.changePassword as jest.Mock).mockResolvedValue({});

    // Act: Call the changePassword method of UserController
    await UserController.changePassword(req, res);

    // Assert: Verify the response status and payload
    expect(res.status).toHaveBeenCalledWith(200); // Check if status 200 was set
    expect(res.json).toHaveBeenCalledWith(handleResponse(null, UserMessages.PasswordChangeSuccessful, ResponseCodes.OK));
  });

  /**
   * Test case for refreshing access token successfully
   */
  it('should refresh access token successfully and return 200', async () => {
    // Arrange: Set up the request and response objects
    const req = mockRequest({ refreshToken: 'validRefreshToken' }, false);
    const res = mockResponse();

    // Define the expected result from UserService.refreshAccessToken
    const result = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken'
    };

    // Mock UserService.refreshAccessToken to resolve with the predefined result
    (UserService.refreshAccessToken as jest.Mock).mockResolvedValue(result);

    // Act: Call the refreshAccessToken method of UserController
    await UserController.refreshAccessToken(req, res);

    // Assert: Verify the response status and payload
    expect(res.status).toHaveBeenCalledWith(200); // Check if status 200 was set
    expect(res.json).toHaveBeenCalledWith(handleResponse(result, UserMessages.RefreshTokenSuccessful, ResponseCodes.OK));
  });
});
