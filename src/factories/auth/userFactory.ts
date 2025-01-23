import AuthUtils from '../../helpers/auth/authHelper';
import UserModel from '../../models/master/userModel';
import RoleModel from '../../models/master/roleModel';
import PermissionModel from '../../models/master/permissionModel';
import { UserMessages, ValidationMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';
import TenantStaffModel from '../../models/tenant/staffModel';
import DatabaseUtils from '../../models/generelisedModel';

const accessTokenLife = parseInt(process.env.ACCESS_TOKEN_LIFE!);
const refreshTokenLife = parseInt(process.env.REFRESH_TOKEN_LIFE!);

/**
 * The UserFactory class handles user authentication and token generation.
 * It extends AuthUtils to leverage authentication-related utilities.
 */
class UserFactory extends AuthUtils {
  private userModel: UserModel;
  private tenantStaffModel: TenantStaffModel;
  private roleModel: RoleModel;
  private permissionModel: PermissionModel;
  private databaseUtils: DatabaseUtils;

  /**
   * Initializes UserFactory with database models.
   * @param db - Knex instance for database interactions.
   */
  constructor(db: Knex) {
    super();
    this.userModel = new UserModel(db);
    this.tenantStaffModel = new TenantStaffModel(db);
    this.roleModel = new RoleModel(db);
    this.permissionModel = new PermissionModel(db);
    this.databaseUtils = new DatabaseUtils(db); // Instantiate DatabaseUtils
  }

  /**
   * Handles user login, verifies credentials, generates tokens, and retrieves user permissions.
   * @param email - The email address of the user.
   * @param password - The password provided by the user.
   * @param isTenant - A boolean indicating if the user is a tenant.
   * @returns An object containing user details, tokens, and permissions.
   * @throws Error if user is not found or credentials are invalid.
   */
  public async login(email: string, password: string, isTenant: boolean) {
    try {
      // Choose the appropriate model based on tenant status
      const model = isTenant ? this.tenantStaffModel : this.userModel;

      // Find user by email
      const user = await model.findByEmail(email);
      if (!user) {
        throw new Error(UserMessages.UserNotFound);
      }

      // Compare provided password with stored password
      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error(ValidationMessages.InvalidCredentials);
      }

      // Determine origin type and id based on whether it's a staff or admin
      const originType = user.staff_uuid ? 2 : 1; // 2 for staff, 1 for admin
      const userId = user.staff_uuid || user.admin_uuid;
      const id = user.id || user.id;

      // Generate access and refresh tokens with the origin type included in the payload
      const payload = { id: userId, email: user.email, "x-request-origin-type": originType };
      const refreshToken = this.generateToken(payload, refreshTokenLife);
      const tableName = isTenant ? 'tenant_refresh_token' : 'refresh_token';
      const data = {
        user_id: id,
        refresh_token: refreshToken
      }
     const sessionId = await this.databaseUtils.insert(tableName, data, ['id']);
     // Include sessionId as gId in the access token payload
     const accessTokenPayload = { ...payload, gId: sessionId[0].id };
     const accessToken = this.generateToken(accessTokenPayload, accessTokenLife);

      // Retrieve user roles and permissions
      const userRoles = await this.roleModel.getRolesByUserId(user.id, isTenant);
      const rolePermissions = await this.roleModel.getPermissionsByUserId(user.id, isTenant);

      // Collect unique permission IDs from rolePermissions
      const permissionIds = rolePermissions.flatMap(rolePerm => 
        rolePerm.role_permissions.map((perm: { permission_id: any; }) => perm.permission_id)
      );
      const permissions = await this.permissionModel.getPermissionsByIds(permissionIds);

      // Map permissions for quick lookup by permission_id
      const permissionsMap = new Map<number, any>(permissions.map(perm => [perm.id, perm]));

      // Structure permissions with details
      const permissionsWithDetails = rolePermissions.map(rolePerm => ({
        grants: rolePerm.role_permissions.map((perm: { permission_id: number; permission_operations: any }) => {
          const permission = permissionsMap.get(perm.permission_id) || { permission_name: 'Unknown', permission_operations: [] };
          return {
            id: perm.permission_id,
            resource: permission.permission_name,
            actions: perm.permission_operations || [] // Assuming permission_operations is an array of actions
          };
        }),
        role: userRoles.length > 0 ? userRoles[0].role_name : ""
      }));
      
      // Return user information, tokens, and permissions
      return {
        userId: userId,
        firstName: user.first_name,
        lastName: user.last_name,
        emailId: user.email || user.email_id,
        profilePic: user.profile_pic || null,
        tokens: {
          accessToken: accessToken,
          accessTokenExpiry: process.env.ACCESS_TOKEN_LIFE,
          refreshToken: refreshToken,
          refreshTokenExpiry: process.env.REFRESH_TOKEN_LIFE
        },
        userType: userRoles.length > 0 ? userRoles[0].role_name : "", 
        permissions: permissionsWithDetails,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refreshes the user's access token by validating the provided refresh token
   * and generating a new access token.
   * @param id - The UUID of the user (tenant or admin).
   * @param isTenant - A boolean indicating if the user is a tenant.
   * @param refreshToken - The refresh token provided by the user.
   * @returns An object containing a new access token.
   * @throws Error if the user is not found or if the refresh token is invalid.
   */
  public async refreshAccessToken(id: string, isTenant: boolean, refreshToken: string) {
    try {
      // Choose the appropriate model based on tenant status
      const model = isTenant ? this.tenantStaffModel : this.userModel;

      // Find user by UUID
      const user = await model.findByUUID(id);
      if (!user) {
        throw new Error(UserMessages.UserNotFound);
      }
      // Verify the provided refresh token
      const decoded = this.verifyToken(refreshToken);
      const tableName = isTenant ? 'tenant_refresh_token' : 'refresh_token';
      const gId = await this.databaseUtils.select(tableName, { user_id: user.id, refresh_token: refreshToken }, ['id']);
      if(!gId || gId.length === 0){
        throw new Error(ValidationMessages.InvalidRefreshToken);
      }
      const userId = decoded.id;
      // Generate a new access token with the extracted payload
      const payload = { id: userId, email: decoded.email,gId:gId[0].id, "x-request-origin-type": decoded["x-request-origin-type"] };
      const accessToken = this.generateToken(payload, accessTokenLife);

      // Return the new access token
      return { accessToken: accessToken,
        accessTokenExpiry: accessTokenLife
      };
    } catch (error) {
      // Throw error if user is not found or if the token is invalid
      throw new Error(UserMessages.UserNotFound);
    }
  }

  /**
   * Changes the user's password after verifying the old password.
   * @param id - The UUID of the user (tenant or admin).
   * @param oldPassword - The current password provided by the user.
   * @param newPassword - The new password to be set for the user.
   * @param isTenant - A boolean indicating if the user is a tenant.
   * @returns A success message if the password is changed successfully.
   * @throws Error if the user is not found, if the old password is incorrect, or if the new password fails to meet criteria.
   */
  public async changePassword(id: string, oldPassword: string, newPassword: string, isTenant: boolean) {
    try {
      // Choose the appropriate model based on tenant status
      const model = isTenant ? this.tenantStaffModel : this.userModel;

      // Find user by UUID
      const user = await model.findByUUID(id);
      if (!user) {
        throw new Error(UserMessages.UserNotFound);
      }

      // Compare provided old password with stored password
      const isMatch = await this.comparePassword(oldPassword, user.password);
      if (!isMatch) {
        throw new Error(ValidationMessages.InvalidCredentials);
      }

      // Hash the new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update the password using DatabaseUtils
      const tableName = isTenant ? 'tenant_staff' : 'saas_admin'; // Adjust table names as necessary
      const idColumn = isTenant ? 'staff_uuid' : 'admin_uuid';
      const updatedRows = await this.databaseUtils.update(tableName, idColumn, id, { password: hashedPassword });

      if (updatedRows === 0) {
        throw new Error('Password update failed.');
      }

      return;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Logs out the user by deleting the refresh token from the database.
   * @param id - The UUID of the user (tenant or admin).
   * @param isTenant - A boolean indicating if the user is a tenant.
   * @returns A success message if the logout is successful.
   * @throws Error if the user is already logged out or if the logout fails.
   */
  public async logout(id: string, sessionId: Number, isTenant: boolean): Promise<void> {
    try {
      // Determine the appropriate table names and column identifiers based on tenant status
      const tableName = isTenant ? 'tenant_refresh_token' : 'refresh_token';
      const userTable = isTenant ? 'tenant_staff' : 'saas_admin';
      const column = isTenant ? 'staff_uuid' : 'admin_uuid';
      const idColumn = 'user_id';

      // Retrieve the user ID from the database using the provided UUID
      const userIdResult = await this.databaseUtils.select(userTable, { [column]: id }, ['id']);
      if (userIdResult.length === 0) {
        // Throw an error if the user is already logged out (no user ID found)
        throw new Error(UserMessages.AlreadyLoggedOut);
      }
      const userId = userIdResult[0].id;

      // Check if a refresh token exists for the user
      const refreshTokenResult = await this.databaseUtils.select(tableName, { user_id: userId, id: sessionId }, ['id']);
      if (refreshTokenResult.length === 0) {
        // Throw an error if no refresh token is found, indicating the user is already logged out
        throw new Error(UserMessages.AlreadyLoggedOut);
      }

      // Delete the refresh token from the database to log the user out
      const deletedRows = await this.databaseUtils.delete(tableName, 'id', sessionId);
      if (deletedRows === 0) {
        // Throw an error if the deletion fails
        throw new Error(UserMessages.LogoutFailed);
      }
    } catch (error) {
      // Rethrow the error to be handled by the calling function
      throw error;
    }
  }

}

export default UserFactory;
