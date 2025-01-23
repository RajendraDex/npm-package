import { Request, Response } from 'express';
import PermissionController from '../../../src/controllers/auth/permissionController';
import PermissionService from '../../../src/services/auth/permissionService';
import { ResponseCodes } from '../../../src/enums/responseCodes';
import { ErrorMessages, PermissionMessages } from '../../../src/enums/responseMessages';

// Mock the PermissionService to isolate the controller tests
jest.mock('../../../src/services/auth/permissionService');

/**
 * Test suite for PermissionController
 * 
 * This module contains unit tests for various methods of the PermissionController.
 * It uses Jest for mocking and assertions.
 */
describe('PermissionController', () => {
  // Declare variables for mocking request and response objects
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  // Set up mock objects before each test
  beforeEach(() => {
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
    };
  });

  /**
   * Tests for createPermission method
   */
  describe('createPermission', () => {
    // Test successful permission creation
    it('should create a permission successfully', async () => {
      // Mock the successful creation of a permission
      const mockResult = { id: 1, name: 'TestPermission' };
      (PermissionService.createPermission as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.createPermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.CREATED);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionCreated,
        code: ResponseCodes.CREATED,
        data: mockResult,
      }));
    });

    // Test handling of existing permission error
    it('should handle permission already exists error', async () => {
      // Mock the service to throw an error for existing permission
      (PermissionService.createPermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionAlreadyExists));

      // Call the controller method
      await PermissionController.createPermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.FORBIDDEN);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionAlreadyExists,
        code: ResponseCodes.FORBIDDEN,
        data: null,
      }));
    });

    // Test handling of unknown errors
    it('should handle unknown errors', async () => {
      // Mock the service to throw an unknown error
      (PermissionService.createPermission as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      // Call the controller method
      await PermissionController.createPermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.InternalServerError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null,
      }));
    });
  });

  /**
   * Tests for getPermissions method
   */
  describe('getPermissions', () => {
    // Test successful fetching of permissions
    it('should fetch permissions successfully', async () => {
      // Mock the successful retrieval of permissions
      const mockResult = [{ id: 1, name: 'TestPermission' }];
      (PermissionService.getPermissions as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.getPermissions(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionsFetched,
        code: ResponseCodes.OK,
        data: mockResult,
      }));
    });

    // Test error handling when fetching permissions
    it('should handle errors when fetching permissions', async () => {
      // Mock the service to throw an error
      (PermissionService.getPermissions as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      // Call the controller method
      await PermissionController.getPermissions(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.InternalServerError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null,
      }));
    });
  });

  /**
   * Tests for updatePermission method
   */
  describe('updatePermission', () => {
    // Test successful permission update
    it('should update a permission successfully', async () => {
      // Mock the successful update of a permission
      const mockResult = { id: 1, name: 'UpdatedPermission' };
      (PermissionService.updatePermission as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.updatePermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionUpdated,
        code: ResponseCodes.OK,
        data: null,
      }));
    });

    // Test handling of permission not found error
    it('should handle permission not found error', async () => {
      // Mock the service to throw a not found error
      (PermissionService.updatePermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      // Call the controller method
      await PermissionController.updatePermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null,
      }));
    });
  });

  /**
   * Tests for updateMultiplePermissions method
   */
  describe('updateMultiplePermissions', () => {
    // Test successful update of multiple permissions
    it('should update multiple permissions successfully', async () => {
      // Mock the successful update of multiple permissions
      const mockResult = {"code": 200, "data": null, "message": "Privilege updated successfully."};
      (PermissionService.updateMultiplePermissions as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.updateMultiplePermissions(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionUpdated,
        code: ResponseCodes.OK,
        data: null,
      }));
    });

    // Test handling of permission not found error
    it('should handle permission not found error', async () => {
      // Mock the service to throw a not found error
      (PermissionService.updateMultiplePermissions as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      // Call the controller method
      await PermissionController.updateMultiplePermissions(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null,
      }));
    });
  });

  /**
   * Tests for deletePermission method
   */
  describe('deletePermission', () => {
    // Test successful permission deletion
    it('should delete a permission successfully', async () => {
      // Mock the successful deletion of a permission
      const mockResult = { id: 1, name: 'DeletedPermission' };
      (PermissionService.deletePermission as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.deletePermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionDeleted,
        code: ResponseCodes.OK,
        data: mockResult,
      }));
    });

    // Test handling of permission not found error
    it('should handle permission not found error', async () => {
      // Mock the service to throw a not found error
      (PermissionService.deletePermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      // Call the controller method
      await PermissionController.deletePermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null,
      }));
    });
  });

  /**
   * Tests for assignRoutesToPermission method
   */
  describe('assignRoutesToPermission', () => {
    // Test successful assignment of routes to a permission
    it('should assign routes to a permission successfully', async () => {
      // Mock the successful assignment of routes to a permission
      const mockResult = { id: 1, name: 'Permission', routes: ['route1', 'route2'] };
      (PermissionService.assignRoutesToPermission as jest.Mock).mockResolvedValue(mockResult);

      // Call the controller method
      await PermissionController.assignRoutesToPermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.RoutesAssigned,
        code: ResponseCodes.OK,
        data: mockResult,
      }));
    });

    // Test handling of permission not found error
    it('should handle permission not found error', async () => {
      // Mock the service to throw a not found error
      (PermissionService.assignRoutesToPermission as jest.Mock).mockRejectedValue(new Error(PermissionMessages.PermissionNotFound));

      // Call the controller method
      await PermissionController.assignRoutesToPermission(mockRequest as Request, mockResponse as Response);

      // Assert the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: PermissionMessages.PermissionNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null,
      }));
    });
  });
});