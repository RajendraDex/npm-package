import { Request, Response } from 'express';
import CustomerController from '../../../../src/controllers/tenant/customerController';
import CustomerService from '../../../../src/services/tenant/customerService';
import { CustomerMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

// Mock the CustomerService
jest.mock('../../../../src/services/tenant/customerService');

describe('CustomerController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
      setHeader: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('createCustomer', () => {
    it('should create a customer successfully', async () => {
      (CustomerService.createCustomer as jest.Mock).mockResolvedValue({});

      await CustomerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.CreateSuccessful,
        code: ResponseCodes.CREATED,
        data: null
      }));
    });

    it('should handle customer already exists error', async () => {
      (CustomerService.createCustomer as jest.Mock).mockRejectedValue(new Error(CustomerMessages.CustomerAlreadyExists));

      await CustomerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.CustomerAlreadyExists,
        code: ResponseCodes.BAD_REQUEST,
        data: null
      }));
    });

    it('should handle phone number already exists error', async () => {
      (CustomerService.createCustomer as jest.Mock).mockRejectedValue(new Error(CustomerMessages.PhoneNumberAlreadyExists));

      await CustomerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.PhoneNumberAlreadyExists,
        code: ResponseCodes.BAD_REQUEST,
        data: null
      }));
    });

    it('should handle unknown errors', async () => {
      (CustomerService.createCustomer as jest.Mock).mockRejectedValue(new Error('Unknown error'));

      await CustomerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Unknown error',
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const updatedCustomer = { id: '1', name: 'Updated Name' };
      (CustomerService.updateCustomer as jest.Mock).mockResolvedValue(updatedCustomer);

      await CustomerController.updateCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: null,
        message: CustomerMessages.UpdateSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle customer not found error', async () => {
      (CustomerService.updateCustomer as jest.Mock).mockRejectedValue(new Error(CustomerMessages.CustomerNotFound));

      await CustomerController.updateCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.CustomerNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });

    it('should handle phone number already exists error', async () => {
      (CustomerService.updateCustomer as jest.Mock).mockRejectedValue(new Error(CustomerMessages.PhoneNumberAlreadyExists));

      await CustomerController.updateCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.PhoneNumberAlreadyExists,
        code: ResponseCodes.BAD_REQUEST,
        data: null
      }));
    });
  });

  describe('getCustomers', () => {
    it('should fetch customers successfully', async () => {
      const customers = [{ id: '1', name: 'Customer 1' }, { id: '2', name: 'Customer 2' }];
      (CustomerService.fetchCustomers as jest.Mock).mockResolvedValue(customers);

      await CustomerController.getCustomers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: customers,
        message: CustomerMessages.FetchSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle errors when fetching customers', async () => {
      (CustomerService.fetchCustomers as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await CustomerController.getCustomers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fetch error',
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });

  describe('updateCustomerFields', () => {
    it('should update customer fields successfully', async () => {
      (CustomerService.updateCustomerFields as jest.Mock).mockResolvedValue({ success: true, message: 'Fields updated' });

      await CustomerController.updateCustomerFields(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Fields updated',
        code: ResponseCodes.OK,
        data: null
      }));
    });

    it('should handle unsuccessful update', async () => {
      (CustomerService.updateCustomerFields as jest.Mock).mockResolvedValue({ success: false, message: 'Update failed' });

      await CustomerController.updateCustomerFields(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Update failed',
        code: ResponseCodes.BAD_REQUEST,
        data: null
      }));
    });
  });

  describe('fetchCustomer', () => {
    it('should fetch a customer successfully', async () => {
      const customer = { id: '1', name: 'Customer 1' };
      (CustomerService.fetchCustomer as jest.Mock).mockResolvedValue(customer);

      await CustomerController.fetchCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        data: customer,
        message: CustomerMessages.FetchSuccessful,
        code: ResponseCodes.OK
      }));
    });

    it('should handle customer not found error', async () => {
      (CustomerService.fetchCustomer as jest.Mock).mockRejectedValue(new Error(CustomerMessages.CustomerNotFound));

      await CustomerController.fetchCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: CustomerMessages.CustomerNotFound,
        code: ResponseCodes.NOT_FOUND,
        data: null
      }));
    });
  });

  describe('exportCustomersToCSV', () => {
    it('should export customers to CSV successfully', async () => {
      const csvData = 'id,name\n1,Customer 1\n2,Customer 2';
      (CustomerService.exportCustomersToCSV as jest.Mock).mockResolvedValue(csvData);

      await CustomerController.exportCustomersToCSV(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename=customers.csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Estimated-Download-Time', expect.any(String));
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(csvData);
    });

    it('should handle errors when exporting customers to CSV', async () => {
      (CustomerService.exportCustomersToCSV as jest.Mock).mockRejectedValue(new Error('Export error'));

      await CustomerController.exportCustomersToCSV(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Export error',
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });
});