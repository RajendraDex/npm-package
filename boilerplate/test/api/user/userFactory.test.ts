import { Knex } from "knex";
import UserFactory from "../../../src/factories/auth/userFactory";
import UserModel from "../../../src/models/master/userModel";
import RoleModel from "../../../src/models/master/roleModel";
import PermissionModel from "../../../src/models/master/permissionModel";
import AuthUtils from "../../../src/helpers/auth/authHelper";
import { UserMessages, ValidationMessages } from "../../../src/enums/responseMessages";
import DatabaseUtils from "../../../src/models/generelisedModel";

// Mock dependencies to isolate UserFactory tests from actual implementations
jest.mock('../../../src/models/master/userModel');
jest.mock('../../../src/models/master/roleModel');
jest.mock('../../../src/models/master/permissionModel');
jest.mock('../../../src/helpers/auth/authHelper');
jest.mock('../../../src/models/generelisedModel'); // Mock DatabaseUtils

// Local mock functions for methods in AuthUtils
const mockComparePassword = jest.fn();
const mockGenerateToken = jest.fn();

describe('UserFactory', () => {
  const db = {} as Knex; // Mocked Knex instance
  const userFactory = new UserFactory(db); // Instantiate UserFactory with mocked db

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
    // Override methods in AuthUtils with local mocks
    jest.spyOn(AuthUtils.prototype, 'comparePassword').mockImplementation(mockComparePassword);
    jest.spyOn(AuthUtils.prototype, 'generateToken').mockImplementation(mockGenerateToken); // Ensure this method exists and is mocked if needed
  });

  /**
   * Test case for successful login
   */
  it('should login successfully and return user data and tokens', async () => {
    // Arrange: Set up input data and mock return values
    const email = 'test@example.com';
    const password = 'password';
    const isTenant = false;

    const user = { id: 1, admin_uuid: "uuid_test_uuid", email, password: 'hashedPassword', username: 'TestUser', first_name: 'Test', last_name: 'User' };
    const userRoles = [{ role_name: 'Admin' }];
    const rolePermissions = [{ role_permissions: [{ permission_id: 1, permission_operations: ['read'] }] }];
    const permissions = [{ id: 1, permission_name: 'Read', permission_operations: ['read'] }];

    // Mock local function return values
    mockComparePassword.mockResolvedValue(true); // Simulate successful password comparison
    mockGenerateToken.mockReturnValue('mockToken'); // Simulate token generation

    // Mock methods in models
    (UserModel.prototype.findByEmail as jest.Mock).mockResolvedValue(user);
    (RoleModel.prototype.getRolesByUserId as jest.Mock).mockResolvedValue(userRoles);
    (RoleModel.prototype.getPermissionsByUserId as jest.Mock).mockResolvedValue(rolePermissions);
    (PermissionModel.prototype.getPermissionsByIds as jest.Mock).mockResolvedValue(permissions);

    // Act: Call the login method of UserFactory
    const result = await userFactory.login(email, password, isTenant);

    // Assert: Verify the result matches the expected output
    expect(result).toEqual({
      userId: "uuid_test_uuid",
      firstName: 'Test',
      lastName: 'User',
      emailId: email,
      profilePic: null,
      tokens: {
        accessToken: 'mockToken', // Token returned by mockGenerateToken
        accessTokenExpiry: process.env.ACCESS_TOKEN_LIFE,
        refreshToken: 'mockToken', // Token returned by mockGenerateToken
        refreshTokenExpiry: process.env.REFRESH_TOKEN_LIFE,
      },
      userType: 'Admin',
      permissions: [{
        grants: [{ id: 1, resource: 'Read', actions: ['read'] }],
        role: 'Admin',
      }],
    });
  });

  /**
   * Test case for user not found scenario
   */
  it('should throw error if user not found', async () => {
    // Arrange: Set up input data and mock methods
    const email = 'test@example.com';
    const password = 'password';
    const isTenant = false;

    // Mock UserModel to return null (user not found)
    (UserModel.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

    // Act & Assert: Verify that the appropriate error is thrown
    await expect(userFactory.login(email, password, isTenant)).rejects.toThrowError(UserMessages.UserNotFound);
  });

  /**
   * Test case for incorrect password scenario
   */
  it('should throw error if password is incorrect', async () => {
    // Arrange: Set up input data and mock methods
    const email = 'test@example.com';
    const password = 'wrongpassword';
    const isTenant = false;

    const user = { id: 1, email, password: 'hashedPassword' };

    // Mock local function to simulate incorrect password comparison
    mockComparePassword.mockResolvedValue(false);

    // Mock UserModel to return a user
    (UserModel.prototype.findByEmail as jest.Mock).mockResolvedValue(user);

    // Act & Assert: Verify that the appropriate error is thrown
    await expect(userFactory.login(email, password, isTenant)).rejects.toThrowError(ValidationMessages.InvalidCredentials);
  });

  /**
   * Test case for successful password change
   */
  it('should change the password successfully', async () => {
    // Arrange
    const id = 'uuid_test_uuid';
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword';
    const isTenant = false;
    const user = { id: 1, admin_uuid: id, password: 'hashedOldPassword' };

    // Mock necessary methods
    mockComparePassword.mockResolvedValue(true); // Simulate successful old password verification
    jest.spyOn(DatabaseUtils.prototype, 'update').mockResolvedValue(1); // Simulate successful database update

    // Mock UserModel to return a user
    (UserModel.prototype.findByUUID as jest.Mock).mockResolvedValue(user);

    // Act
    const result = await userFactory.changePassword(id, oldPassword, newPassword, isTenant);

    // Assert
    expect(result).toBeUndefined(); // Successful change does not return a value
  });

  /**
   * Test case for failed password change due to incorrect old password
   */
  it('should throw error if old password is incorrect', async () => {
    // Arrange
    const id = 'uuid_test_uuid';
    const oldPassword = 'wrongOldPassword';
    const newPassword = 'newPassword';
    const isTenant = false;
    const user = { id: 1, admin_uuid: id, password: 'hashedOldPassword' };

    // Mock necessary methods
    mockComparePassword.mockResolvedValue(false); // Simulate failed old password verification

    // Mock UserModel to return a user
    (UserModel.prototype.findByUUID as jest.Mock).mockResolvedValue(user);

    // Act & Assert
    await expect(userFactory.changePassword(id, oldPassword, newPassword, isTenant))
      .rejects.toThrowError(ValidationMessages.InvalidCredentials);
  });

  /**
   * Test case for successful access token refresh
   */
  it('should refresh access token successfully', async () => {
    // Arrange
    const id = 'uuid_test_uuid';
    const isTenant = false;
    const refreshToken = 'validRefreshToken';
    const user = { id: 1, admin_uuid: id, email: 'test@example.com' };
    const decodedToken = { id, email: user.email, "x-request-origin-type": 1 };

    // Mock necessary methods
    jest.spyOn(AuthUtils.prototype, 'verifyToken').mockReturnValue(decodedToken);
    mockGenerateToken.mockReturnValue('newAccessToken');

    // Mock UserModel to return a user
    (UserModel.prototype.findByUUID as jest.Mock).mockResolvedValue(user);

    // Act
    const result = await userFactory.refreshAccessToken(id, isTenant, refreshToken);

    // Assert
    const accessTokenLife = parseInt(process.env.ACCESS_TOKEN_LIFE || '3600'); // Use environment variable or default
    expect(result).toEqual({
      accessToken: 'newAccessToken',
      accessTokenExpiry: accessTokenLife
    });
  });

  /**
   * Test case for failed access token refresh due to invalid refresh token
   */
  it('should throw error if refresh token is invalid', async () => {
    // Arrange
    const id = 'uuid_test_uuid';
    const isTenant = false;
    const refreshToken = 'invalidRefreshToken';

    // Mock necessary methods
    jest.spyOn(AuthUtils.prototype, 'verifyToken').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // Act & Assert
    await expect(userFactory.refreshAccessToken(id, isTenant, refreshToken))
      .rejects.toThrowError('Incorrect username or password. Please try again.');
  });
});
