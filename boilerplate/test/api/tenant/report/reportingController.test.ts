import { Request, Response } from 'express';
import ReportingController from '../../../../src/controllers/tenant/reportingController';
import ReportingService from '../../../../src/services/tenant/reportingService';
import { ReportMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

// Mock the ReportingService
jest.mock('../../../../src/services/tenant/reportingService');

describe('ReportingController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    // Initialize mock request and response objects before each test
    mockRequest = {};
    responseJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: responseJson,
      setHeader: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('fetchCommissionReports', () => {
    it('should fetch commission reports successfully', async () => {
      // Mock data to be returned by the service
      const reportData = {
        result: [
          {
            id: "9f11b868-2e71-4b87-bd19-91d3861d43c9",
            providername: "john cursor",
            date: "2024-10-24T18:30:00.000Z",
            serviceName: ["Facial", "Hair cut"],
            serviceCount: [1, 1],
            servicePrice: ["₹303.00", "₹300.00"],
            commissionPercentage: "12.02",
            commissionAmount: ["₹36.42", "₹36.06"]
          },
          {
            id: "9f11b868-2e71-4b87-bd19-91d3861d43c9",
            providername: "john cursor",
            date: "2024-10-27T18:30:00.000Z",
            serviceName: ["Hair cut"],
            serviceCount: [1],
            servicePrice: ["₹300.00"],
            commissionPercentage: "12.02",
            commissionAmount: ["₹36.06"]
          }
        ],
        totalPages: 1,
        currentPage: 1,
        totalCommission: "₹3775.12",
        commission: "₹108.54",
        totalRecords: 2
      };
      // Mock the service method to return the mock data
      (ReportingService.fetchCommissionReport as jest.Mock).mockResolvedValue(reportData);

      // Call the controller method
      await ReportingController.fetchCommissionReports(mockRequest as Request, mockResponse as Response);

      // Validate the response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.OK);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ReportMessages.FetchSuccessful,
        code: ResponseCodes.OK,
        data: reportData
      }));
    });

    it('should handle errors when fetching commission reports', async () => {
      // Mock the service method to throw an error
      (ReportingService.fetchCommissionReport as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      // Call the controller method
      await ReportingController.fetchCommissionReports(mockRequest as Request, mockResponse as Response);

      // Validate the error response
      expect(mockResponse.status).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith(expect.objectContaining({
        message: ErrorMessages.InternalServerError,
        code: ResponseCodes.INTERNAL_SERVER_ERROR,
        data: null
      }));
    });
  });
});
