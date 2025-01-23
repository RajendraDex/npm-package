
import { Knex } from 'knex';
import CustomerModel from '../../../../src/models/tenant/customerModel';
import CustomerFactory from '../../../../src/factories/tenant/customerFactory';
import { TenantCustomer } from '../../../../src/interfaces/tenantInterface';
import { CustomerMessages } from '../../../../src/enums/responseMessages';

// Mock the CustomerModel
jest.mock('../../../../src/models/tenant/customerModel');

describe('CustomerFactory', () => {
  let customerFactory: CustomerFactory;
  let mockDb: Knex;
  let mockCustomerModel: jest.Mocked<CustomerModel>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockCustomerModel = new CustomerModel(mockDb) as jest.Mocked<CustomerModel>;
    customerFactory = new CustomerFactory(mockDb);
    (customerFactory as any).customerModel = mockCustomerModel; // Inject mock CustomerModel
  });

  describe('createCustomer', () => {
    const mockCustomerData = {
      firstName: 'John',
      lastName: 'Doe',
      emailId: 'john@example.com',
      countryCode: 1,
      phoneNumber: '1234567890',
      password: 'password123',
      gender: 'm' as 'm' | 'f' | 'o',
    };

    it('should create a new customer successfully', async () => {
      mockCustomerModel.getCustomerByField.mockResolvedValue(undefined);
      mockCustomerModel.createCustomer.mockResolvedValue([{ customer_uuid: 'uuid123' } as TenantCustomer]);

      const result = await customerFactory.createCustomer(mockCustomerData);

      expect(result).toHaveLength(1);
      expect(result[0].customer_uuid).toBe('uuid123');
    });

    it('should throw an error if customer with email already exists', async () => {
      mockCustomerModel.getCustomerByField.mockResolvedValueOnce({} as TenantCustomer);

      await expect(customerFactory.createCustomer(mockCustomerData))
        .rejects.toThrow(CustomerMessages.CustomerAlreadyExists);
    });

    it('should throw an error if phone number already exists', async () => {
      mockCustomerModel.getCustomerByField
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce({} as TenantCustomer);

      await expect(customerFactory.createCustomer(mockCustomerData))
        .rejects.toThrow(CustomerMessages.PhoneNumberAlreadyExists);
    });
  });

  describe('updateCustomer', () => {
    const mockCustomerId = 'customer123';
    const mockUpdateData = {
      firstName: 'Jane',
      lastName: 'Doe',
      emailId: 'jane@example.com',
    };

    it('should update an existing customer successfully', async () => {
      mockCustomerModel.getCustomerById.mockResolvedValue({} as TenantCustomer);
      mockCustomerModel.updateCustomer.mockResolvedValue([{ customer_uuid: mockCustomerId } as TenantCustomer]);

      const result = await customerFactory.updateCustomer(mockCustomerId, mockUpdateData);

      expect(result).toHaveLength(1);
      expect(result[0].customer_uuid).toBe(mockCustomerId);
    });

    it('should throw an error if customer is not found', async () => {
      mockCustomerModel.getCustomerById.mockResolvedValue(undefined);

      await expect(customerFactory.updateCustomer(mockCustomerId, mockUpdateData))
        .rejects.toThrow(CustomerMessages.CustomerNotFound);
    });
  });

  describe('fetchCustomers', () => {
    const mockFetchParams = {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc' as 'asc' | 'desc',
      search: '',
    };

    it('should fetch customers with pagination', async () => {
      const mockResult = {
        result: [{ customer_uuid: 'uuid1', first_name: 'John' }],
        totalPages: 1,
        currentPage: 1,
      };
      mockCustomerModel.fetchCustomers.mockResolvedValue(mockResult);

      const result = await customerFactory.fetchCustomers(
        mockFetchParams.page,
        mockFetchParams.limit,
        mockFetchParams.sortBy,
        mockFetchParams.sortOrder,
        mockFetchParams.search
      );

      expect(result.result).toHaveLength(1);
      expect(result.result[0].id).toBe('uuid1');
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
    });
  });

  describe('updateCustomerFields', () => {
    const mockCustomerUUID = 'customer123';
    const mockFieldsToUpdate = { status: 1 };

    it('should update specific fields of a customer', async () => {
      mockCustomerModel.getCustomerById.mockResolvedValue({} as TenantCustomer);
      mockCustomerModel.updateCustomerFields.mockResolvedValue([{ customer_uuid: mockCustomerUUID } as TenantCustomer]);

      const result = await customerFactory.updateCustomerFields(mockCustomerUUID, mockFieldsToUpdate);

      expect(result.success).toBe(true);
      expect(result.message).toBe(CustomerMessages.CustomerStatusChangedSuccessfully);
    });

    it('should return failure message if customer is not found', async () => {
      mockCustomerModel.getCustomerById.mockResolvedValue(undefined);

      const result = await customerFactory.updateCustomerFields(mockCustomerUUID, mockFieldsToUpdate);

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });
  });

  describe('fetchCustomer', () => {
    const mockCustomerId = 'customer123';

    it('should fetch a specific customer by ID', async () => {
      const mockCustomer = {
        customer_uuid: mockCustomerId,
        first_name: 'John',
        last_name: 'Doe',
        email_id: 'john@example.com',
      } as TenantCustomer;
      mockCustomerModel.getCustomerById.mockResolvedValue(mockCustomer);

      const result = await customerFactory.fetchCustomer(mockCustomerId);

      expect(result.id).toBe(mockCustomerId);
      expect(result.firstName).toBe('John');
    });

    it('should throw an error if customer is not found', async () => {
      mockCustomerModel.getCustomerById.mockResolvedValue(undefined);

      await expect(customerFactory.fetchCustomer(mockCustomerId))
        .rejects.toThrow(CustomerMessages.CustomerNotFound);
    });
  });

  describe('fetchAllCustomersForExport', () => {
    it('should fetch all customers for export', async () => {
      const mockCustomers = [
        { customer_uuid: 'uuid1' },
        { customer_uuid: 'uuid2' },
      ] as TenantCustomer[];
      mockCustomerModel.getCustomers.mockResolvedValue(mockCustomers);

      const result = await customerFactory.fetchAllCustomersForExport();

      expect(result).toHaveLength(2);
      expect(result[0].customer_uuid).toBe('uuid1');
      expect(result[1].customer_uuid).toBe('uuid2');
    });

    it('should throw an error if fetching customers fails', async () => {
      mockCustomerModel.getCustomers.mockRejectedValue(new Error('Database error'));

      await expect(customerFactory.fetchAllCustomersForExport())
        .rejects.toThrow('Error fetching customers for export');
    });
  });
});