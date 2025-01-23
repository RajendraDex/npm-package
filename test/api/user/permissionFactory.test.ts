import { Knex } from 'knex';
import PermissionFactory from '../../../src/factories/auth/permissionFactory';
import PermissionModel from '../../../src/models/master/permissionModel';
import { ErrorMessages, PermissionMessages } from '../../../src/enums/responseMessages';

// Mock the PermissionModel to isolate PermissionFactory tests
jest.mock('../../../src/models/master/permissionModel');

describe('PermissionFactory', () => {
  // Declare variables for factory instance and mock database
  let permissionFactory: PermissionFactory;
  let mockDb: Knex;

  // Set up before each test
  beforeEach(() => {
    mockDb = {} as Knex;
    permissionFactory = new PermissionFactory(mockDb);
  });

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPermission', () => {
    it('should create a new permission successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockPermissionData = { permission_name: 'test_permission' };
      const mockCreatedPermission = { id: 1, ...mockPermissionData };

      (PermissionModel.prototype.doesPermissionExist as jest.Mock).mockResolvedValue(false);
      (PermissionModel.prototype.createPermission as jest.Mock).mockResolvedValue(mockCreatedPermission);

      // Act: Call the method being tested
      const result = await permissionFactory.createPermission(mockPermissionData);

      // Assert: Check the results
      expect(result).toEqual(mockCreatedPermission);
    });

    it('should throw an error if permission already exists', async () => {
      // Arrange: Mock the existence check to return true
      (PermissionModel.prototype.doesPermissionExist as jest.Mock).mockResolvedValue(true);

      // Act & Assert: Check that the correct error is thrown
      await expect(permissionFactory.createPermission({ permission_name: 'existing_permission' }))
        .rejects.toThrow(PermissionMessages.PermissionAlreadyExists);
    });
  });

  describe('getPermissions', () => {
    it('should retrieve all permissions', async () => {
      // Arrange: Set up mock data
      const mockPermissions = [{ id: 1, permission_name: 'test_permission' }];
      (PermissionModel.prototype.getPermissions as jest.Mock).mockResolvedValue(mockPermissions);

      // Act: Call the method being tested
      const result = await permissionFactory.getPermissions();

      // Assert: Check the results
      expect(result).toEqual(mockPermissions);
    });

    it('should throw an error if retrieval fails', async () => {
      // Arrange: Mock the getPermissions method to throw an error
      (PermissionModel.prototype.getPermissions as jest.Mock).mockRejectedValue(new Error());

      // Act & Assert: Check that the correct error is thrown
      await expect(permissionFactory.getPermissions())
        .rejects.toThrow(ErrorMessages.InternalServerError);
    });
  });

  describe('getPermissionById', () => {
    it('should retrieve a specific permission by ID', async () => {
      // Arrange: Set up mock data
      const mockPermission = { id: 1, permission_name: 'test_permission' };
      (PermissionModel.prototype.getPermissionById as jest.Mock).mockResolvedValue(mockPermission);

      // Act: Call the method being tested
      const result = await permissionFactory.getPermissionById(1);

      // Assert: Check the results
      expect(result).toEqual(mockPermission);
    });

    it('should throw an error if permission is not found', async () => {
      // Arrange: Mock the getPermissionById method to return null
      (PermissionModel.prototype.getPermissionById as jest.Mock).mockResolvedValue(null);

      // Act & Assert: Check that the correct error is thrown
      await expect(permissionFactory.getPermissionById(999))
        .rejects.toThrow(PermissionMessages.PermissionNotFound);
    });
  });

  describe('deletePermission', () => {
    it('should delete a permission successfully', async () => {
      // Arrange: Mock successful deletion
      (PermissionModel.prototype.deletePermission as jest.Mock).mockResolvedValue(true);

      // Act: Call the method being tested
      const result = await permissionFactory.deletePermission(1);

      // Assert: Check the results
      expect(result).toEqual({ message: PermissionMessages.PermissionDeleted });
    });

    it('should throw an error if permission is not found', async () => {
      // Arrange: Mock unsuccessful deletion
      (PermissionModel.prototype.deletePermission as jest.Mock).mockResolvedValue(false);

      // Act & Assert: Check that the correct error is thrown
      await expect(permissionFactory.deletePermission(999))
        .rejects.toThrow(PermissionMessages.PermissionNotFound);
    });
  });

  describe('updateMultiplePermissions', () => {
    it('should update multiple permissions successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockUpdates = [
        { permissionId: 1, updateData: { permissionOperations: ['read', 'create'] } },
        { permissionId: 2, updateData: { permissionOperations: ['read', 'update'] } }
      ];
      const mockResult = [
        { id: 1, permission_operations: '{read,create}' },
        { id: 2, permission_operations: '{read,update}' }
      ];

      (PermissionModel.prototype.updateMultiplePermissions as jest.Mock).mockResolvedValue(mockResult);

      // Act: Call the method being tested
      const result = await permissionFactory.updateMultiplePermissions(mockUpdates);

      // Assert: Check the results
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if invalid operations are provided', async () => {
      // Arrange: Set up mock data with invalid operations
      const mockUpdates = [
        { permissionId: 1, updateData: { permissionOperations: ['read', 'invalid'] } }
      ];

      // Act & Assert: Check that the correct error is thrown
      await expect(permissionFactory.updateMultiplePermissions(mockUpdates))
        .rejects.toThrow('An unknown error occurred')
    });
  });
});
