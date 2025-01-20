import { Request } from 'express';
import TenantService from '../../../../src/services/tenant/tenantService';
import TenantFactory from '../../../../src/factories/tenant/tenantFactory';
import { ErrorMessages, TenantMessages } from '../../../../src/enums/responseMessages';

// Extend the Request type to include the knex property
interface ExtendedRequest extends Request {
  knex: any;
}

// Mock TenantFactory to isolate TenantService tests
jest.mock('../../../../src/factories/tenant/tenantFactory');

describe('TenantService', () => {
  // Declare variables for mocking
  let mockRequest: Partial<ExtendedRequest>;
  let mockKnex: any;

  // Set up mocks before each test
  beforeEach(() => {
    mockKnex = jest.fn();
    mockRequest = {
      knex: mockKnex,
      body: {},
      params: {},
      query: {},
    };
    // Clear all instances and calls to constructor and all methods of TenantFactory:
    (TenantFactory as jest.Mock).mockClear();
  });

  describe('createTenant', () => {
    it('should create a tenant successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockTenantData = { name: 'Test Tenant' };
      const mockCreatedTenant = { id: 1, ...mockTenantData };
      
      mockRequest.body = mockTenantData;
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        createTenant: jest.fn().mockResolvedValue(mockCreatedTenant),
      }));

      // Act: Call the method being tested
      const result = await TenantService.createTenant(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockCreatedTenant);
      expect(TenantFactory).toHaveBeenCalledWith(mockKnex);
    });

    it('should throw an error if tenant already exists', async () => {
      // Arrange: Mock TenantFactory to throw DomainAlreadyExists error
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        createTenant: jest.fn().mockRejectedValue(new Error(TenantMessages.DomainAlreadyExists)),
      }));

      // Act & Assert: Check that the correct error is thrown
      await expect(TenantService.createTenant(mockRequest as ExtendedRequest))
        .rejects.toThrow(TenantMessages.TenantAlreadyExists);
    });

    it('should throw an unknown error for other errors', async () => {
      // Arrange: Mock TenantFactory to throw an unknown error
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        createTenant: jest.fn().mockRejectedValue(new Error('Unknown error')),
      }));

      // Act & Assert: Check that the unknown error is thrown
      await expect(TenantService.createTenant(mockRequest as ExtendedRequest))
        .rejects.toThrow('Unknown error');
    });
  });

  describe('fetchTenants', () => {
    it('should fetch tenants successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockTenants = [{ id: 1, name: 'Tenant 1' }, { id: 2, name: 'Tenant 2' }];
      mockRequest.query = { page: '1', limit: '10', sortBy: 'name', sortOrder: 'asc', search: 'test', status: '1' };
      
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenants: jest.fn().mockResolvedValue(mockTenants),
      }));

      // Act: Call the method being tested
      const result = await TenantService.fetchTenants(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockTenants);
      expect(TenantFactory).toHaveBeenCalledWith(mockKnex);
    });

    it('should throw an unknown error if fetching fails', async () => {
      // Arrange: Mock TenantFactory to throw an error when fetching
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenants: jest.fn().mockRejectedValue(new Error('Fetch failed')),
      }));

      // Act & Assert: Check that the unknown error is thrown
      await expect(TenantService.fetchTenants(mockRequest as ExtendedRequest))
        .rejects.toThrow(ErrorMessages.UnknownError);
    });
  });

  describe('fetchTenant', () => {
    it('should fetch a single tenant successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockTenant = { id: 1, name: 'Test Tenant' };
      mockRequest.params = { tenantId: '1' };
      
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenant: jest.fn().mockResolvedValue(mockTenant),
      }));

      // Act: Call the method being tested
      const result = await TenantService.fetchTenant(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockTenant);
      expect(TenantFactory).toHaveBeenCalledWith(mockKnex);
    });

    it('should throw CompanyNotExists error', async () => {
      // Arrange: Mock TenantFactory to throw CompanyNotExists error
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenant: jest.fn().mockRejectedValue(new Error(TenantMessages.CompanyNotExists)),
      }));

      // Act & Assert: Check that the correct error is thrown
      await expect(TenantService.fetchTenant(mockRequest as ExtendedRequest))
        .rejects.toThrow(TenantMessages.CompanyNotExists);
    });

    it('should throw AddressNotFound error', async () => {
      // Arrange: Mock TenantFactory to throw AddressNotFound error
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenant: jest.fn().mockRejectedValue(new Error(TenantMessages.AddressNotFound)),
      }));

      // Act & Assert: Check that the correct error is thrown
      await expect(TenantService.fetchTenant(mockRequest as ExtendedRequest))
        .rejects.toThrow(TenantMessages.AddressNotFound);
    });

    it('should throw an unknown error for other errors', async () => {
      // Arrange: Mock TenantFactory to throw an unknown error
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        fetchTenant: jest.fn().mockRejectedValue(new Error('Unknown error')),
      }));

      // Act & Assert: Check that the unknown error is thrown with the correct message
      await expect(TenantService.fetchTenant(mockRequest as ExtendedRequest))
        .rejects.toThrow(`${ErrorMessages.UnknownError}: Unknown error`);
    });
  });

  describe('updateTenantStatus', () => {
    it('should update tenant status successfully', async () => {
      // Arrange: Set up mock data and behavior
      const mockUpdatedTenant = { id: 1, name: 'Test Tenant', status: 2 };
      mockRequest.params = { tenantId: '1' };
      mockRequest.body = { status: 2 };
      
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        updateTenantStatus: jest.fn().mockResolvedValue(mockUpdatedTenant),
      }));

      // Act: Call the method being tested
      const result = await TenantService.updateTenantStatus(mockRequest as ExtendedRequest);

      // Assert: Check the results
      expect(result).toEqual(mockUpdatedTenant);
      expect(TenantFactory).toHaveBeenCalledWith(mockKnex);
    });

    it('should throw an error if update fails', async () => {
      // Arrange: Mock TenantFactory to throw an error when updating
      const mockError = new Error('Update failed');
      (TenantFactory as jest.Mock).mockImplementation(() => ({
        updateTenantStatus: jest.fn().mockRejectedValue(mockError),
      }));

      // Act & Assert: Check that the error is thrown
      await expect(TenantService.updateTenantStatus(mockRequest as ExtendedRequest))
        .rejects.toThrow(mockError);
    });
  });
});