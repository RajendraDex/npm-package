import { Request, Response } from 'express';
import RoleController from '../../../src/controllers/auth/roleController';
import RoleService from '../../../src/services/auth/roleService';
import { handleResponse } from '../../../src/utils/error';
import { ResponseCodes } from '../../../src/enums/responseCodes';
import { ErrorMessages, RoleMessages } from '../../../src/enums/responseMessages';
jest.mock('../../../src/services/auth/roleService'); // Mock the RoleService to control its behavior in the tests
jest.mock('../../../src/utils/error', () => ({
  handleResponse: jest.fn(), // Mock the handleResponse function to verify how it's used
}));

// Mocked services and functions for testing purposes
const mockedRoleService = RoleService as jest.Mocked<typeof RoleService>;
const mockedHandleResponse = handleResponse as jest.MockedFunction<typeof handleResponse>;

describe('RoleController', () => {
  let req: Partial<Request>; // Partial request object for testing
  let res: Partial<Response>; // Partial response object for testing

  beforeEach(() => {
    // Initialize request and response mocks before each test case
    req = {};
    res = {
      status: jest.fn().mockReturnThis(), // Mock status method to chain with json method
      json: jest.fn(), // Mock json method to check response payloads
    };
  });

  afterEach(() => {
    // Clear mocks after each test case to prevent interference between tests
    jest.clearAllMocks();
  });

  // Test cases for the `createRole` method
  describe('createRole', () => {
    it('should create a role and return 201 status', async () => {
      // Mock successful role creation
      (mockedRoleService.createRole as jest.Mock).mockResolvedValueOnce(undefined);
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's createRole method
      await RoleController.createRole(req as Request, res as Response);

      // Assert that the response status and JSON payload are correct
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('should handle RoleAlreadyExists error', async () => {
      // Mock error when role already exists
      (mockedRoleService.createRole as jest.Mock).mockRejectedValueOnce(new Error(RoleMessages.RoleAlreadyExists));
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's createRole method
      await RoleController.createRole(req as Request, res as Response);

      // Assert that the correct error code and message are returned
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({});
    });

    // Additional error handling tests can be added here (e.g., validation errors)
  });

  // Test cases for the `updateRole` method
  describe('updateRole', () => {
    it('should update a role and return 200 status', async () => {
      // Mock successful role update
      (mockedRoleService.updateRole as jest.Mock).mockResolvedValueOnce(undefined);
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's updateRole method
      await RoleController.updateRole(req as Request, res as Response);

      // Assert that the response status and JSON payload are correct
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('should handle RoleNotFound error', async () => {
      // Mock error when role is not found
      (mockedRoleService.updateRole as jest.Mock).mockRejectedValueOnce(new Error(RoleMessages.RoleNotFound));
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's updateRole method
      await RoleController.updateRole(req as Request, res as Response);

      // Assert that the correct error code and message are returned
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({});
    });

    // Additional error handling tests can be added here (e.g., invalid input)
  });

  // Test cases for the `getRoles` method
  describe('getRoles', () => {
    it('should fetch roles and return 200 status', async () => {
      // Mock fetching roles successfully
      (mockedRoleService.getRoles as jest.Mock).mockResolvedValueOnce([]);
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's getRoles method
      await RoleController.getRoles(req as Request, res as Response);

      // Assert that the response status and JSON payload are correct
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('should handle internal server error', async () => {
      // Mock an internal server error
      (mockedRoleService.getRoles as jest.Mock).mockRejectedValueOnce(new Error(ErrorMessages.InternalServerError));
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's getRoles method
      await RoleController.getRoles(req as Request, res as Response);

      // Assert that the correct error code and message are returned
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({});
    });

    // Additional error handling tests can be added here (e.g., database errors)
  });

  // Test cases for the `getRoleById` method
  describe('getRoleById', () => {
    it('should fetch a role by ID and return 200 status', async () => {
      // Mock fetching role by ID successfully
      (mockedRoleService.getRoleById as jest.Mock).mockResolvedValueOnce({});
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's getRoleById method
      await RoleController.getRoleById(req as Request, res as Response);

      // Assert that the response status and JSON payload are correct
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('should handle RoleNotFound error', async () => {
      // Mock error when role is not found
      (mockedRoleService.getRoleById as jest.Mock).mockRejectedValueOnce(new Error(RoleMessages.RoleNotFound));
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's getRoleById method
      await RoleController.getRoleById(req as Request, res as Response);

      // Assert that the correct error code and message are returned
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({});
    });

    // Additional error handling tests can be added here
  });

  // Test cases for the `deleteRoleById` method
  describe('deleteRoleById', () => {
    it('should delete a role and return 200 status', async () => {
      // Mock successful deletion of a role
      (mockedRoleService.deleteRoleById as jest.Mock).mockResolvedValueOnce(RoleMessages.RoleFetched);
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's deleteRoleById method
      await RoleController.deleteRoleById(req as Request, res as Response);

      // Assert that the response status and JSON payload are correct
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(res.json).toHaveBeenCalledWith({});
    });

    it('should handle RoleAssociatedWithUser error', async () => {
      // Mock error when the role is associated with a user
      (mockedRoleService.deleteRoleById as jest.Mock).mockRejectedValueOnce(new Error(RoleMessages.RoleAssociatedWithUser));
      (mockedHandleResponse as jest.Mock).mockReturnValueOnce({});

      // Call the controller's deleteRoleById method
      await RoleController.deleteRoleById(req as Request, res as Response);

      // Assert that the correct error code and message are returned
      expect(res.status).toHaveBeenCalledWith(ResponseCodes.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });
});
