import CustomerService from '../../../../src/services/tenant/customerService';
import CustomerFactory from '../../../../src/factories/tenant/customerFactory';
import { ErrorMessages, CustomerMessages } from '../../../../src/enums/responseMessages';
import { Request } from 'express';
import { Parser } from 'json2csv';
import { TenantCustomer } from '../../../../src/interfaces/tenantInterface';

// Mock CustomerFactory
jest.mock('../../../../src/factories/tenant/customerFactory');

// Mock json2csv Parser
jest.mock('json2csv', () => ({
  Parser: jest.fn().mockImplementation(() => ({
    parse: jest.fn().mockReturnValue('mocked,csv,data'),
  })),
}));

describe('CustomerService', () => {
  let mockRequest: Partial<Request> & { knex?: any };
  let mockCustomerFactory: jest.Mocked<CustomerFactory>;

  beforeEach(() => {
    mockRequest = {
      knex: {},
      body: {},
      params: {},
      query: {},
      method: 'GET',
    };
    mockCustomerFactory = new CustomerFactory({} as any) as jest.Mocked<CustomerFactory>;
    (CustomerFactory as jest.MockedClass<typeof CustomerFactory>).mockImplementation(() => mockCustomerFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      const mockCustomerData = { first_name: 'John', last_name: 'Doe' };
      const mockCreatedCustomer: TenantCustomer[] = [{
        id: 1,
        customer_uuid: '1',
        first_name: 'John',
        last_name: 'Doe',
        email_id: 'john@example.com',
        country_code: 91,
        phone_number: '1234567890',
        customer_status: 1,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }];
      mockRequest.body = mockCustomerData;
      mockCustomerFactory.createCustomer.mockResolvedValue(mockCreatedCustomer);

      const result = await CustomerService.createCustomer(mockRequest as Request);

      expect(result).toEqual(mockCreatedCustomer);
      expect(mockCustomerFactory.createCustomer).toHaveBeenCalledWith(mockCustomerData);
    });

    // ... other tests remain the same
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const mockCustomerId = 123;
      const mockCustomerUUID = "accd-1ac3-123-xcdcd-23dff";
      const mockUpdateData = { first_name: 'Jane' };
      const mockUpdatedCustomer: TenantCustomer[] = [{
        id: mockCustomerId,
        customer_uuid: mockCustomerUUID,
        first_name: 'Jane',
        last_name: 'Doe',
        email_id: 'jane@example.com',
        country_code: 91,
        phone_number: '1234567890',
        customer_status: 1,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }];
      mockRequest.params = { id: mockCustomerUUID };
      mockRequest.body = mockUpdateData;
      mockCustomerFactory.updateCustomer.mockResolvedValue(mockUpdatedCustomer);

      const result = await CustomerService.updateCustomer(mockRequest as Request);

      expect(result).toEqual(mockUpdatedCustomer);
      expect(mockCustomerFactory.updateCustomer).toHaveBeenCalledWith(mockCustomerUUID, mockUpdateData);
    });

    // ... other tests remain the same
  });

  describe('updateCustomerFields', () => {
    it('should update customer status for PATCH request', async () => {
      mockRequest.method = 'PATCH';
      mockRequest.body = { status: 1, customerId: '123' };
      const mockUpdateResult = { 
        success: true, 
        message: CustomerMessages.CustomerStatusChangedSuccessfully,
        data: { status: 1 }
      };
      mockCustomerFactory.updateCustomerFields.mockResolvedValue(mockUpdateResult as any);

      const result = await CustomerService.updateCustomerFields(mockRequest as Request);

      expect(result).toEqual(mockUpdateResult);
      expect(mockCustomerFactory.updateCustomerFields).toHaveBeenCalledWith('123', { status: 1 });
    });

    it('should update customer isDeleted for DELETE request', async () => {
      mockRequest.method = 'DELETE';
      mockRequest.body = { isDeleted: true, customerId: '123' };
      const mockUpdateResult = { 
        success: true, 
        message: CustomerMessages.CustomerDeleted,
        data: { isDeleted: true }
      };
      mockCustomerFactory.updateCustomerFields.mockResolvedValue(mockUpdateResult as any);

      const result = await CustomerService.updateCustomerFields(mockRequest as Request);

      expect(result).toEqual(mockUpdateResult);
      expect(mockCustomerFactory.updateCustomerFields).toHaveBeenCalledWith('123', { isDeleted: true });
    });
  });

  describe('fetchCustomer', () => {
    it('should fetch a specific customer successfully', async () => {
      const mockCustomerId = '123';
      const mockCustomer = {
        id: mockCustomerId,
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john@example.com',
        gender: 'Male',
        profilePic: 'profile.jpg',
        countryCode: 91,
        phoneNumber: '1234567890',
        status: 1,
        isDeleted: false,
        additionalInfo: {}
      };
      mockRequest.params = { id: mockCustomerId };
      mockCustomerFactory.fetchCustomer.mockResolvedValue(mockCustomer);

      const result = await CustomerService.fetchCustomer(mockRequest as Request);

      expect(result).toEqual(mockCustomer);
      expect(mockCustomerFactory.fetchCustomer).toHaveBeenCalledWith(mockCustomerId);
    });

    // ... other tests remain the same
  });

  describe('exportCustomersToCSV', () => {
    it('should export customers to CSV successfully', async () => {
      const mockCustomers: TenantCustomer[] = [{
        id: 1,
        customer_uuid: '1',
        first_name: 'John',
        last_name: 'Doe',
        email_id: 'john@example.com',
        country_code: 91,
        phone_number: '1234567890',
        customer_status: 1,
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }];
      mockCustomerFactory.fetchAllCustomersForExport.mockResolvedValue(mockCustomers);

      const result = await CustomerService.exportCustomersToCSV(mockRequest as Request);

      expect(result).toBe('mocked,csv,data');
      expect(mockCustomerFactory.fetchAllCustomersForExport).toHaveBeenCalled();
      expect(Parser).toHaveBeenCalledWith({
        fields: expect.arrayContaining([
          expect.objectContaining({ label: 'id', value: 'customer_uuid' }),
          expect.objectContaining({ label: 'First Name', value: 'first_name' }),
          expect.objectContaining({ label: 'Last Name', value: 'last_name' }),
          expect.objectContaining({ label: 'Email', value: 'email_id' }),
          expect.objectContaining({ label: 'Country Code', value: 'country_code' }),
          expect.objectContaining({ label: 'Phone Number', value: 'phone_number' }),
          expect.objectContaining({ label: 'Status', value: 'customer_status' }),
          expect.objectContaining({ label: 'IsDeleted', value: 'is_deleted' })
        ])
      });
    });
  });
});