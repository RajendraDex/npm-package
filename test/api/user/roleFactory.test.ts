import { Knex } from 'knex';
import RoleFactory from '../../../src/factories/auth/roleFactory';
import RoleModel from '../../../src/models/master/roleModel';
import { ErrorMessages, RoleMessages } from '../../../src/enums/responseMessages';

// Mock the RoleModel
jest.mock('../../../src/models/master/roleModel');

describe('RoleFactory', () => {
  let roleFactory: RoleFactory;
  let mockDb: Knex;
  let mockRoleModel: jest.Mocked<RoleModel>;

  beforeEach(() => {
    mockDb = {} as Knex;
    mockRoleModel = new RoleModel(mockDb) as jest.Mocked<RoleModel>;
    roleFactory = new RoleFactory(mockDb);
    (roleFactory as any).roleModel = mockRoleModel;
  });

  describe('createRole', () => {
    it('should create a new role when it does not exist', async () => {
      const roleData = { role_name: 'TestRole' };
      mockRoleModel.getRolesByName.mockResolvedValue([]);
      mockRoleModel.createRole.mockResolvedValue([roleData]);

      const result = await roleFactory.createRole(roleData);

      expect(mockRoleModel.getRolesByName).toHaveBeenCalledWith(roleData.role_name);
      expect(mockRoleModel.createRole).toHaveBeenCalledWith(roleData);
      expect(result).toEqual([roleData]); // Expect an array
    });

    it('should throw an error when the role already exists', async () => {
      const roleData = { role_name: 'ExistingRole' };
      mockRoleModel.getRolesByName.mockResolvedValue([roleData]);

      await expect(roleFactory.createRole(roleData)).rejects.toThrow(RoleMessages.RoleAlreadyExists);
    });
  });

  describe('updateRole', () => {
    it('should update an existing role', async () => {
      const roleId = 1;
      const roleData = { role_name: 'UpdatedRole' };
      mockRoleModel.getRolesById.mockResolvedValue([{ id: roleId }]);
      mockRoleModel.updateRole.mockResolvedValue([roleData]);

      const result = await roleFactory.updateRole(roleId, roleData);

      expect(mockRoleModel.getRolesById).toHaveBeenCalledWith(roleId);
      expect(mockRoleModel.updateRole).toHaveBeenCalledWith(roleId, roleData);
      expect(result).toEqual([roleData]); // Expect an array
    });

    it('should throw an error when the role does not exist', async () => {
      const roleId = 999;
      const roleData = { role_name: 'NonExistentRole' };
      mockRoleModel.getRolesById.mockResolvedValue([]);

      await expect(roleFactory.updateRole(roleId, roleData)).rejects.toThrow(RoleMessages.RoleNotFound);
    });
  });

  describe('getRoleById', () => {
    it('should return a role with its permissions', async () => {
      const roleId = 1;
      const mockRole = {
        id: roleId,
        role_name: 'TestRole',
        role_permissions: [{ permission_id: 1, permission_operations: ['read'] }]
      };
      const mockPermissions = [{ id: 1, permission_name: 'TestPermission' }];

      mockRoleModel.getRolesById.mockResolvedValue([mockRole]);
      mockRoleModel.getPermissionsByIds.mockResolvedValue(mockPermissions);

      const result = await roleFactory.getRoleById(roleId);

      expect(mockRoleModel.getRolesById).toHaveBeenCalledWith(roleId);
      expect(mockRoleModel.getPermissionsByIds).toHaveBeenCalledWith([1]);
      expect(result).toEqual({
        id: roleId,
        role: 'TestRole',
        grants: [{ resource: 'TestPermission', actions: ['read'], id: 1 }]
      });
    });

    it('should throw an error when the role is not found', async () => {
      const roleId = 999;
      mockRoleModel.getRolesById.mockResolvedValue([]);

      await expect(roleFactory.getRoleById(roleId)).rejects.toThrow(RoleMessages.RoleNotFound);
    });
  });

  describe('getRoles', () => {
    it('should return all roles', async () => {
      const mockRoles = [{ id: 1, role_name: 'Role1' }, { id: 2, role_name: 'Role2' }];
      mockRoleModel.getRoles.mockResolvedValue(mockRoles);

      const result = await roleFactory.getRoles();

      expect(mockRoleModel.getRoles).toHaveBeenCalled();
      expect(result).toEqual(mockRoles);
    });

    it('should throw an error when there is a database error', async () => {
      mockRoleModel.getRoles.mockRejectedValue(new Error('Database error'));

      await expect(roleFactory.getRoles()).rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  describe('deleteRoleById', () => {
    it('should delete a role when it is not associated with any user', async () => {
      const roleId = 1;
      mockRoleModel.checkRoleAssociation.mockResolvedValue(false);
      mockRoleModel.deleteRoleById.mockResolvedValue(1);

      const result = await roleFactory.deleteRoleById(roleId);

      expect(mockRoleModel.checkRoleAssociation).toHaveBeenCalledWith(roleId);
      expect(mockRoleModel.deleteRoleById).toHaveBeenCalledWith(roleId);
      expect(result).toEqual({ success: true, message: RoleMessages.RoleDeleted });
    });

    it('should throw an error when the role is associated with a user', async () => {
      const roleId = 1;
      mockRoleModel.checkRoleAssociation.mockResolvedValue(true);

      await expect(roleFactory.deleteRoleById(roleId)).rejects.toThrow(RoleMessages.RoleAssociatedWithUser);
    });

    it('should return false when the role is not found', async () => {
      const roleId = 999;
      mockRoleModel.checkRoleAssociation.mockResolvedValue(false);
      mockRoleModel.deleteRoleById.mockResolvedValue(0);

      const result = await roleFactory.deleteRoleById(roleId);

      expect(result).toEqual({ success: false, message: RoleMessages.RoleNotFound });
    });
  });
});