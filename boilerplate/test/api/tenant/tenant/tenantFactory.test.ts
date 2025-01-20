import { Knex } from 'knex';
import { mock, MockProxy } from 'jest-mock-extended';
import { v4 as uuidv4 } from 'uuid';
import TenantFactory from '../../../../src/factories/tenant/tenantFactory';
import TenantModel from '../../../../src/models/master/tenantModel';
import IOperationHoursModel from '../../../../src/models/tenant/operationHoursModel';
import AddressModel from '../../../../src/models/tenant/addressModel';
import { getKnexWithConfig } from '../../../../src/db/knexfile';
import { initializeDatabase } from '../../../../src/db/createAndMigrateDatabase';
import { insertTenantStaff } from '../../../../src/db/migrations/conditionalMigrations';
import { TenantMessages } from '../../../../src/enums/responseMessages';

// Mock all external dependencies
jest.mock('../../../../src/models/master/tenantModel');
jest.mock('../../../../src/models/tenant/addressModel');
jest.mock('../../../../src/models/tenant/operationHoursModel');
jest.mock('../../../../src/db/createAndMigrateDatabase');
jest.mock('../../../../src/db/migrations/conditionalMigrations');
jest.mock('../../../../src/db/knexfile');
jest.mock('uuid');

/**
 * Test suite for TenantFactory
 * This suite tests the functionality of the TenantFactory class
 */
describe('TenantFactory', () => {
  // Declare variables for mocking
  let tenantFactory: TenantFactory;
  let mockDb: MockProxy<Knex>;
  let mockTenantModel: jest.Mocked<TenantModel>;
  let mockAddressModel: jest.Mocked<AddressModel>;
  let mockOperationHoursModel: jest.Mocked<IOperationHoursModel>;

  // Set up mocks before each test
  beforeEach(() => {
    // Create mock instances
    mockDb = mock<Knex>();
    mockTenantModel = new TenantModel(mockDb) as jest.Mocked<TenantModel>;
    mockAddressModel = new AddressModel(mockDb) as jest.Mocked<AddressModel>;
    mockOperationHoursModel = new IOperationHoursModel(mockDb) as jest.Mocked<IOperationHoursModel>;
    
    // Mock the constructor implementations
    (TenantModel as jest.Mock).mockImplementation(() => mockTenantModel);
    (AddressModel as jest.Mock).mockImplementation(() => mockAddressModel);
    (IOperationHoursModel as jest.Mock).mockImplementation(() => mockOperationHoursModel);
    
    // Create an instance of TenantFactory with the mock database
    tenantFactory = new TenantFactory(mockDb);
  });

  /**
   * Tests for createTenant method
   */
  describe('createTenant', () => {
    // Mock tenant data for testing
    const mockTenantData = {
      companyName: 'Test Company',
      registrationNumber: '12345',
      emailId: 'test@example.com',
      phoneNumber: '1234567890',
      username: 'testuser',
      password: 'password123',
      domainName: 'testcompany',
      addressLine1: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      countryCode: '1',
      country: 'Test Country',
      zipcode: '12345',
      contactFirstName: 'John',
      contactLastName: 'Doe',
      contactEmailId: 'john@example.com',
      contactPhoneNumber: '0987654321',
      operationHours: [
        { dayOfWeek: 'MON', startTime: '09:00', endTime: '17:00' }
      ]
    };

    it('should create a new tenant successfully', async () => {
      // Mock successful tenant creation scenario
      mockTenantModel.findByDomainName.mockResolvedValue(null);
      mockTenantModel.createTenant.mockResolvedValue([{ 
        tenant_uuid: 'test-uuid',
        db_name: 'test_db',
        db_host: 'localhost',
        db_username: 'user',
        db_password: 'password'
      }]);
      (uuidv4 as jest.Mock).mockReturnValue('test-uuid');
      (getKnexWithConfig as jest.Mock).mockReturnValue(mockDb);
      mockAddressModel.addAddress.mockResolvedValue(1);
      mockOperationHoursModel.addIOperationHours.mockResolvedValue(1);
      (initializeDatabase as jest.Mock).mockResolvedValue(undefined);
      (insertTenantStaff as jest.Mock).mockResolvedValue(undefined);

      // Call the method and check the result
      const result = await tenantFactory.createTenant(mockTenantData);

      // Assert the expected behavior
      expect(result).toBeDefined();
      expect(result.tenant_uuid).toBe('test-uuid');
      expect(mockTenantModel.createTenant).toHaveBeenCalled();
      expect(initializeDatabase).toHaveBeenCalled();
      expect(mockAddressModel.addAddress).toHaveBeenCalled();
      expect(mockOperationHoursModel.addIOperationHours).toHaveBeenCalled();
      expect(insertTenantStaff).toHaveBeenCalled();
    });

    it('should throw an error if tenant already exists', async () => {
      // Mock scenario where tenant already exists
      mockTenantModel.findByDomainName.mockResolvedValue({ id: 1 } as any);

      // Assert that the correct error is thrown
      await expect(tenantFactory.createTenant(mockTenantData))
        .rejects.toThrow(TenantMessages.DomainAlreadyExists);
    });
  });

  /**
   * Tests for fetchTenants method
   */
  describe('fetchTenants', () => {
    it('should fetch tenants successfully', async () => {
      // Mock successful tenant fetching scenario
      const mockTenants = [
        { tenant_uuid: '1', tenant_name: 'Company 1', email_id: 'company1@example.com', phone_number: '1234567890', tenant_status: 1, contact_first_name: 'John', contact_last_name: 'Doe' },
        { tenant_uuid: '2', tenant_name: 'Company 2', email_id: 'company2@example.com', phone_number: '0987654321', tenant_status: 1, contact_first_name: 'Jane', contact_last_name: 'Smith' },
      ];
      mockTenantModel.fetchTenants.mockResolvedValue({
        result: mockTenants,
        totalPages: 1,
        currentPage: 1
      });

      // Call the method and check the result
      const result = await tenantFactory.fetchTenants(1, 10, 'tenant_name', 'asc', '');

      // Assert the expected behavior
      expect(result.result).toHaveLength(2);
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.result[0]).toHaveProperty('id', '1');
      expect(result.result[0]).toHaveProperty('tenantName', 'Company 1');
    });
  });

  /**
   * Tests for fetchTenant method
   */
  describe('fetchTenant', () => {
    // Mock tenant data for testing
    const mockTenant = {
      tenant_uuid: 'test-uuid',
      tenant_name: 'Test Company',
      email_id: 'test@example.com',
      phone_number: '1234567890',
      tenant_status: 1,
      contact_first_name: 'John',
      contact_last_name: 'Doe',
      db_name: 'test_db',
      db_host: 'localhost',
      db_username: 'user',
      db_password: 'password'
    };

    it('should fetch a single tenant successfully', async () => {
      // Mock successful single tenant fetching scenario
      mockTenantModel.findByUUID.mockResolvedValue(mockTenant);
      (getKnexWithConfig as jest.Mock).mockReturnValue(mockDb);
      mockAddressModel.getAddress.mockResolvedValue([{
        id: 1,
        contact_first_name: 'John',
        contact_last_name: 'Doe',
        email_id: 'john@example.com',
        country_code: '1',
        phone_number: '1234567890',
        address_line1: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipcode: '12345'
      }]);
      mockOperationHoursModel.getIOperationHoursByTenantAddressId.mockResolvedValue([
        {
            id: 1, day_of_week: 'MON', start_time: '09:00', end_time: '17:00',
            tenant_address_id: 0
        }
      ]);

      // Call the method and check the result
      const result = await tenantFactory.fetchTenant('test-uuid');

      // Assert the expected behavior
      expect(result.tenant).toBeDefined();
      expect(result.tenant.id).toBe('test-uuid');
      expect(result.tenant.address).toBeDefined();
      expect(result.tenant.operationHours).toBeDefined();
    });

    it('should throw an error if tenant does not exist', async () => {
      // Mock scenario where tenant doesn't exist
      mockTenantModel.findByUUID.mockResolvedValue(null);

      // Assert that the correct error is thrown
      await expect(tenantFactory.fetchTenant('non-existent'))
        .rejects.toThrow(TenantMessages.CompanyNotExists);
    });

    it('should throw an error if address is not found', async () => {
      // Mock scenario where address is not found
      mockTenantModel.findByUUID.mockResolvedValue(mockTenant);
      (getKnexWithConfig as jest.Mock).mockReturnValue(mockDb);
      mockAddressModel.getAddress.mockResolvedValue([]);

      // Assert that the correct error is thrown
      await expect(tenantFactory.fetchTenant('test-uuid'))
        .rejects.toThrow(TenantMessages.AddressNotFound);
    });
  });

  /**
   * Tests for updateTenantStatus method
   */
  describe('updateTenantStatus', () => {
    it('should update tenant status successfully', async () => {
      // Mock successful tenant status update scenario
      const mockTenant = {
        tenant_uuid: 'test-uuid',
        tenant_status: 1,
      };
      mockTenantModel.findByUUID.mockResolvedValue(mockTenant);
      mockTenantModel.updateTenantStatus.mockResolvedValue([1]);

      // Call the method and check the result
      const result = await tenantFactory.updateTenantStatus('test-uuid', 2);

      // Assert the expected behavior
      expect(result).toEqual([1]);
      expect(mockTenantModel.updateTenantStatus).toHaveBeenCalledWith('test-uuid', 2);
    });

    it('should throw an error if tenant does not exist', async () => {
      // Mock scenario where tenant doesn't exist
      mockTenantModel.findByUUID.mockResolvedValue(null);

      // Assert that the correct error is thrown
      await expect(tenantFactory.updateTenantStatus('non-existent', 2))
        .rejects.toThrow('Tenant with ID non-existent not found.');
    });
  });
});