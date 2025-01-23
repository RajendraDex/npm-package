import { Request, Response } from 'express';
import TenantController from '../../../../src/controllers/tenant/tenantController';
import TenantService from '../../../../src/services/tenant/tenantService';
import { ResponseCodes } from '../../../../src/enums/responseCodes';
import { ErrorMessages, TenantMessages } from '../../../../src/enums/responseMessages';

// Mock the entire TenantService to isolate the controller tests
jest.mock('../../../../src/services/tenant/tenantService');

/**
 * Test suite for TenantController
 * This suite tests various methods of the TenantController
 */
describe('TenantController', () => {
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
    jest.clearAllMocks();
  });

  /**
   * Tests for createTenant method
   */
  describe('createTenant', () => {
    // Test successful tenant creation
    it('should create a tenant successfully', async () => {
      (TenantService.createTenant as jest.Mock).mockResolvedValue("");

      await TenantController.createTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.CREATED,
        data: null,
        message: TenantMessages.CreateSuccessful,
      });
    });

    // Test handling of existing tenant error
    it('should handle tenant already exists error', async () => {
      (TenantService.createTenant as jest.Mock).mockRejectedValue(new Error(TenantMessages.TenantAlreadyExists));

      await TenantController.createTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.CONFLICT,
        data: null,
        message: TenantMessages.TenantAlreadyExists,
      });
    });

    // Test handling of unknown errors
    it('should handle unknown errors', async () => {
      (TenantService.createTenant as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      await TenantController.createTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Unknown error',
      });
    });
  });

  /**
   * Tests for getTenants method
   */
  describe('getTenants', () => {
    // Test successful fetching of tenants
    it('should fetch tenants successfully', async () => {
      const mockTenants = [{ id: 1, name: 'Tenant 1' }];
      (TenantService.fetchTenants as jest.Mock).mockResolvedValue(mockTenants);

      await TenantController.getTenants(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.OK,
        data: mockTenants,
        message: TenantMessages.CompaniesFetched,
      });
    });

    // Test error handling when fetching tenants
    it('should handle errors when fetching tenants', async () => {
      (TenantService.fetchTenants as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await TenantController.getTenants(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Fetch error',
      });
    });
  });

  /**
   * Tests for getTenant method
   */
  describe('getTenant', () => {
    // Test successful fetching of a specific tenant
    it('should fetch a specific tenant successfully', async () => {
      const mockTenant = { id: 1, name: 'Tenant 1' };
      (TenantService.fetchTenant as jest.Mock).mockResolvedValue(mockTenant);

      await TenantController.getTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.OK,
        data: mockTenant,
        message: TenantMessages.Fetched,
      });
    });

    // Test handling of non-existent company error
    it('should handle company not exists error', async () => {
      (TenantService.fetchTenant as jest.Mock).mockRejectedValue(new Error(TenantMessages.CompanyNotExists));

      await TenantController.getTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.BAD_REQUEST,
        data: null,
        message: TenantMessages.CompanyNotExists,
      });
    });

    // Test handling of address not found error
    it('should handle address not found error', async () => {
      (TenantService.fetchTenant as jest.Mock).mockRejectedValue(new Error(TenantMessages.AddressNotFound));

      await TenantController.getTenant(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.BAD_REQUEST,
        data: null,
        message: TenantMessages.AddressNotFound,
      });
    });
  });

  /**
   * Tests for updateTenantStatus method
   */
  describe('updateTenantStatus', () => {
    // Test successful update of tenant status
    it('should update tenant status successfully', async () => {
      (TenantService.updateTenantStatus as jest.Mock).mockResolvedValue(undefined);

      await TenantController.updateTenantStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.OK,
        data: null,
        message: TenantMessages.StatusUpdateSuccessful,
      });
    });

    // Test handling of tenant not found error
    it('should handle tenant not found error', async () => {
      (TenantService.updateTenantStatus as jest.Mock).mockRejectedValue(new Error('Tenant with ID 1 not found'));

      await TenantController.updateTenantStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.NOT_FOUND,
        data: null,
        message: 'Tenant with ID 1 not found',
      });
    });

    // Test handling of other errors during status update
    it('should handle other errors', async () => {
      (TenantService.updateTenantStatus as jest.Mock).mockRejectedValue(new Error('Update error'));

      await TenantController.updateTenantStatus(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null,
        message: 'Update error',
      });
    });
  });
});