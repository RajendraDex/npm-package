import PermissionService from '../../../src/services/auth/permissionService';
import PermissionFactory from '../../../src/factories/auth/permissionFactory';
import { Request } from 'express';
import { PermissionMessages, ErrorMessages, DatabaseMessages } from '../../../src/enums/responseMessages';
import { Knex } from 'knex';

// Mock the PermissionFactory to isolate PermissionService tests
jest.mock('../../../src/factories/auth/permissionFactory');

// Extend the Request type to include the knex property
interface ExtendedRequest extends Request {
  knex?: Knex;
}

/**
 * Test suite for PermissionService
 * 
 * This module contains unit tests for various methods of the PermissionService.
 * It uses Jest for mocking and assertions.
 */
describe('PermissionService', () => {
  let mockRequest: Partial<ExtendedRequest>;

  // Set up mock objects before each test
  beforeEach(() => {
    mockRequest = {
      knex: {} as Knex,
      body: {}
    };
    jest.clearAllMocks();
  });

  /**
   * Tests for getDbName method
   */
  describe('getDbName', () => {
    it('should return the database name when configured', () => {
      const result = (PermissionService as any).getDbName(mockRequest as ExtendedRequest);
      expect(result).toBeDefined();
    });

    it('should throw an error when database is not configured', () => {
      mockRequest.knex = undefined;
      expect(() => (PermissionService as any).getDbName(mockRequest as ExtendedRequest))
        .toThrow(DatabaseMessages.DatabaseNotConfigured);
    });
  });

  /**
   * Tests for createPermission method
   */
  describe('createPermission', () => {
    it('should create a permission successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockPermission = { id: 1, permission_name: 'test_permission' };
      (PermissionFactory.prototype.createPermission as jest.Mock).mockResolvedValue(mockPermission);

      mockRequest.body = {
        permissionName: 'test_permission',
        permissionDescription: 'Test description',
        permissionOperations: ['read', 'write'],
        createdBy: 'user1'
      };

      // Act: Call the method being tested
      const result = await PermissionService.createPermission(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockPermission);
    });

    it('should throw an error if permission already exists', async () => {
      // Arrange: Mock PermissionFactory to throw PermissionAlreadyExists error
      (PermissionFactory.prototype.createPermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionAlreadyExists));

      mockRequest.body = {
        permissionName: 'existing_permission',
        permissionDescription: 'Test description',
        permissionOperations: ['read'],
        createdBy: 'user1'
      };

      // Act & Assert: Check that the correct error is thrown
      await expect(PermissionService.createPermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(PermissionMessages.PermissionAlreadyExists);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.createPermission as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.createPermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for getPermissions method
   */
  describe('getPermissions', () => {
    it('should retrieve and format permissions correctly', async () => {
      // Arrange: Set up mock permissions data
      const mockPermissions = [
        { id: 1, permission_name: 'resource1', permission_operations: '{"read","write"}' },
        { id: 2, permission_name: 'resource2', permission_operations: '{"read"}' }
      ];
      (PermissionFactory.prototype.getPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      // Act: Call the method being tested
      const result = await PermissionService.getPermissions(mockRequest as ExtendedRequest);

      // Assert: Check the formatted results
      expect(result).toEqual([
        { id: 1, resource: 'resource1', actions: ['read', 'write'] },
        { id: 2, resource: 'resource2', actions: ['read'] }
      ]);
    });

    it('should handle empty permission operations', async () => {
      // Arrange: Set up mock permissions with empty operations
      const mockPermissions = [
        { id: 1, permission_name: 'resource1', permission_operations: '{}' },
      ];
      (PermissionFactory.prototype.getPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      // Act: Call the method being tested
      const result = await PermissionService.getPermissions(mockRequest as ExtendedRequest);

      // Assert: Check that empty operations are handled correctly
      expect(result).toEqual([
        { id: 1, resource: 'resource1', actions: [] },
      ]);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.getPermissions as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.getPermissions(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for getPermissionsWithRoutes method
   */
  describe('getPermissionsWithRoutes', () => {
    it('should retrieve permissions with routes successfully', async () => {
      // Arrange: Set up mock permissions with routes data
      const mockPermissionsWithRoutes = [{ id: 1, permission_name: 'test', routes: ['/api/test'] }];
      (PermissionFactory.prototype.getPermissionsWithRoutes as jest.Mock).mockResolvedValue(mockPermissionsWithRoutes);

      // Act: Call the method being tested
      const result = await PermissionService.getPermissionsWithRoutes(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockPermissionsWithRoutes);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.getPermissionsWithRoutes as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.getPermissionsWithRoutes(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for updatePermission method
   */
  describe('updatePermission', () => {
    it('should update a permission successfully', async () => {
      // Arrange: Set up mock updated permission data
      const mockUpdatedPermission = { id: 1, permission_name: 'updated_permission' };
      (PermissionFactory.prototype.updatePermission as jest.Mock).mockResolvedValue(mockUpdatedPermission);

      mockRequest.body = {
        permissionId: 1,
        updateData: { permission_name: 'updated_permission' }
      };

      // Act: Call the method being tested
      const result = await PermissionService.updatePermission(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockUpdatedPermission);
    });

    it('should throw an error if permission is not found', async () => {
      // Arrange: Mock PermissionFactory to throw PermissionNotFound error
      (PermissionFactory.prototype.updatePermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      mockRequest.body = {
        permissionId: 999,
        updateData: { permission_name: 'non_existent' }
      };

      // Act & Assert: Check that the correct error is thrown
      await expect(PermissionService.updatePermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(PermissionMessages.PermissionNotFound);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.updatePermission as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.updatePermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for updateMultiplePermissions method
   */
  describe('updateMultiplePermissions', () => {
    it('should update multiple permissions successfully', async () => {
      // Arrange: Set up mock updated permissions data
      const mockUpdatedPermissions = [
        { id: 1, permission_name: 'updated_permission_1' },
        { id: 2, permission_name: 'updated_permission_2' }
      ];
      (PermissionFactory.prototype.updateMultiplePermissions as jest.Mock).mockResolvedValue(mockUpdatedPermissions);

      mockRequest.body = [
        { id: 1, actions: ['read', 'write'] },
        { id: 2, actions: ['read'] }
      ];

      // Act: Call the method being tested
      const result = await PermissionService.updateMultiplePermissions(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockUpdatedPermissions);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.updateMultiplePermissions as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.updateMultiplePermissions(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for deletePermission method
   */
  describe('deletePermission', () => {
    it('should delete a permission successfully', async () => {
      // Arrange: Set up mock delete result
      const mockDeleteResult = { success: true };
      (PermissionFactory.prototype.deletePermission as jest.Mock).mockResolvedValue(mockDeleteResult);

      mockRequest.body = { permissionId: 1 };

      // Act: Call the method being tested
      const result = await PermissionService.deletePermission(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockDeleteResult);
    });

    it('should throw an error if permission is not found', async () => {
      // Arrange: Mock PermissionFactory to throw PermissionNotFound error
      (PermissionFactory.prototype.deletePermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      mockRequest.body = { permissionId: 999 };

      // Act & Assert: Check that the correct error is thrown
      await expect(PermissionService.deletePermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(PermissionMessages.PermissionNotFound);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.deletePermission as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.deletePermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  /**
   * Tests for assignRoutesToPermission method
   */
  describe('assignRoutesToPermission', () => {
    it('should assign routes to a permission successfully', async () => {
      // Arrange: Set up mock assign result
      const mockAssignResult = { success: true };
      (PermissionFactory.prototype.assignRoutesToPermission as jest.Mock).mockResolvedValue(mockAssignResult);

      mockRequest.body = { permissionId: 1, routes: ['/api/test1', '/api/test2'] };

      // Act: Call the method being tested
      const result = await PermissionService.assignRoutesToPermission(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockAssignResult);
    });

    it('should throw an error if permission is not found', async () => {
      // Arrange: Mock PermissionFactory to throw PermissionNotFound error
      (PermissionFactory.prototype.assignRoutesToPermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      mockRequest.body = { permissionId: 999, routes: ['/api/test'] };

      // Act & Assert: Check that the correct error is thrown
      await expect(PermissionService.assignRoutesToPermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(PermissionMessages.PermissionNotFound);
    });

    it('should throw an internal server error for unknown errors', async () => {
      // Arrange: Mock PermissionFactory to throw an unknown error
      (PermissionFactory.prototype.assignRoutesToPermission as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Act & Assert: Check that the internal server error is thrown
      await expect(PermissionService.assignRoutesToPermission(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });
});