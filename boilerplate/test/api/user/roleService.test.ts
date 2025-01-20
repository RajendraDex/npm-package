import { Request } from 'express';
import { Knex } from 'knex';
import RoleFactory from '../../../src/factories/auth/roleFactory';
import roleService from '../../../src/services/auth/roleService';
import { RoleMessages } from '../../../src/enums/responseMessages';

jest.mock('../../../src/factories/auth/roleFactory');

describe('RoleService', () => {
  let mockRequest: Partial<Request>;
  let mockKnex: jest.Mocked<Knex>;

  beforeEach(() => {
    mockKnex = {} as jest.Mocked<Knex>;
    mockRequest = {
      knex: mockKnex,
    } as Partial<Request>;
  });

  describe('createRole', () => {
    it('should create a role successfully', async () => {
      const mockRoleData = {
        roleName: 'TestRole',
        roleDescription: 'Test Description',
        grants: [{ id: 1, actions: ['read', 'write'] }],
      };
      mockRequest.body = mockRoleData;

      const mockCreatedRole = { id: 1, ...mockRoleData };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.createRole.mockResolvedValue([mockCreatedRole]);

      const result = await roleService.createRole(mockRequest as Request);

      expect(result).toEqual([mockCreatedRole]); // Expect an array
      expect(RoleFactory.prototype.createRole).toHaveBeenCalledWith({
        role_name: mockRoleData.roleName,
        role_description: mockRoleData.roleDescription,
        role_permissions: expect.any(String),
      });
    });

    it('should throw an error if role already exists', async () => {
      mockRequest.body = {
        roleName: 'ExistingRole',
        roleDescription: 'Existing Description',
        grants: [],
      };

      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.createRole.mockRejectedValue(new Error(RoleMessages.RoleAlreadyExists));

      await expect(roleService.createRole(mockRequest as Request)).rejects.toThrow(RoleMessages.RoleAlreadyExists);
    });
  });

  describe('updateRole', () => {
    it('should update a role successfully', async () => {
      const mockRoleId = '1';
      const mockRoleData = {
        roleName: 'UpdatedRole',
        roleDescription: 'Updated Description',
        grants: [{ id: 2, actions: ['read'] }],
      };
      mockRequest.params = { id: mockRoleId };
      mockRequest.body = mockRoleData;

      const mockUpdatedRole = { id: 1, ...mockRoleData };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.updateRole.mockResolvedValue([mockUpdatedRole]);

      const result = await roleService.updateRole(mockRequest as Request);

      expect(result).toEqual(mockUpdatedRole);
      expect(RoleFactory.prototype.updateRole).toHaveBeenCalledWith(1, {
        role_name: mockRoleData.roleName,
        role_description: mockRoleData.roleDescription,
        role_permissions: expect.any(Array),
      });
    });

    it('should throw an error if role is not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { roleName: 'NonExistentRole', roleDescription: 'Description', grants: [] };

      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.updateRole.mockResolvedValue([]);

      await expect(roleService.updateRole(mockRequest as Request)).rejects.toThrow(RoleMessages.RoleNotFound);
    });
  });

  // Add more test cases for getRoles, getRoleById, and deleteRoleById methods
  describe('getRoles', () => {
    it('should retrieve all roles successfully', async () => {
      const mockRoles = [
        { id: 1, role_name: 'Admin' },
        { id: 2, role_name: 'User' },
      ];
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.getRoles.mockResolvedValue(mockRoles);

      const result = await roleService.getRoles(mockRequest as Request);

      expect(result).toEqual([
        { role: 'Admin', roleId: 1 },
        { role: 'User', roleId: 2 },
      ]);
    });
  });

  describe('getRoleById', () => {
    it('should retrieve a role by id successfully', async () => {
      const mockRoleId = '1';
      const mockRole = { id: 1, role_name: 'Admin', role_description: 'Administrator' };
      mockRequest.params = { id: mockRoleId };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.getRoleById.mockResolvedValue(mockRole);

      const result = await roleService.getRoleById(mockRequest as Request);

      expect(result).toEqual(mockRole);
    });

    it('should throw an error if role is not found', async () => {
      mockRequest.params = { id: '999' };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.getRoleById.mockRejectedValue(new Error(RoleMessages.RoleNotFound));

      await expect(roleService.getRoleById(mockRequest as Request)).rejects.toThrow(RoleMessages.RoleNotFound);
    });
  });

  describe('deleteRoleById', () => {
    it('should delete a role successfully', async () => {
      const mockRoleId = '1';
      mockRequest.params = { id: mockRoleId };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.deleteRoleById.mockResolvedValue({ success: true, message: 'Role deleted successfully' });

      const result = await roleService.deleteRoleById(mockRequest as Request);

      expect(result).toBe('Role deleted successfully');
    });

    it('should throw an error if role is not found', async () => {
      mockRequest.params = { id: '999' };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.deleteRoleById.mockResolvedValue({ success: false, message: RoleMessages.RoleNotFound });

      await expect(roleService.deleteRoleById(mockRequest as Request)).rejects.toThrow(RoleMessages.RoleNotFound);
    });

    it('should throw an error if role is associated with a user', async () => {
      mockRequest.params = { id: '1' };
      (RoleFactory as jest.MockedClass<typeof RoleFactory>).prototype.deleteRoleById.mockResolvedValue({ success: false, message: RoleMessages.RoleAssociatedWithUser });

      await expect(roleService.deleteRoleById(mockRequest as Request)).rejects.toThrow(RoleMessages.RoleAssociatedWithUser);
    });
  });
});