import { Request } from 'express';
import ReportingService from '../../../../src/services/tenant/reportingService';
import ReportingFactory from '../../../../src/factories/tenant/reportingFactory';
import { ErrorMessages } from '../../../../src/enums/responseMessages';

// Mock the ReportingFactory
jest.mock('../../../../src/factories/tenant/reportingFactory');

describe('ReportingService', () => {
    let req: Partial<Request>;
    let reportingFactoryMock: jest.Mocked<ReportingFactory>;

    beforeEach(() => {
        // Initialize mock request and ReportingFactory before each test
        req = {
            query: {},
        };
        reportingFactoryMock = new ReportingFactory(jest.fn() as any) as jest.Mocked<ReportingFactory>;
        (ReportingFactory as jest.Mock).mockImplementation(() => reportingFactoryMock);
    });

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks();
    });

    describe('fetchCommissionReport', () => {
        it('should fetch commission report successfully', async () => {
            // Set query parameters for the request
            req.query = {
                providerId: '123',
                fromDate: '2021-01-01',
                toDate: '2021-01-31',
                page: '1',
                limit: '10'
            };
            // Mock the fetchCommissionReport method to return mock data
            reportingFactoryMock.fetchCommissionReport.mockResolvedValue({
                data: [],
                totalRecords: 0
            });

            // Call the service method
            const result = await ReportingService.fetchCommissionReport(req as Request);

            // Validate the result
            expect(result).toEqual({
                data: [],
                totalRecords: 0
            });
            // Ensure the fetchCommissionReport method was called with correct parameters
            expect(reportingFactoryMock.fetchCommissionReport).toHaveBeenCalledWith(
                '123', '2021-01-01', '2021-01-31', 1, 10
            );
        });

        it('should throw an internal server error if the database operation fails', async () => {
            // Set query parameters for the request
            req.query = {
                providerId: '123',
                fromDate: '2021-01-01',
                toDate: '2021-01-31',
                page: '1',
                limit: '10'
            };
            // Mock the fetchCommissionReport method to throw an error
            reportingFactoryMock.fetchCommissionReport.mockRejectedValue(new Error('Database error'));

            // Expect an internal server error to be thrown
            await expect(ReportingService.fetchCommissionReport(req as Request)).rejects.toThrow(ErrorMessages.InternalServerError);
        });

        it('should handle unknown errors gracefully', async () => {
            // Set query parameters for the request
            req.query = {
                providerId: '123',
                fromDate: '2021-01-01',
                toDate: '2021-01-31',
                page: '1',
                limit: '10'
            };
            // Mock the fetchCommissionReport method to throw an unknown error
            reportingFactoryMock.fetchCommissionReport.mockRejectedValue({ message: 'Unexpected error' });

            // Expect an unknown error to be thrown
            await expect(ReportingService.fetchCommissionReport(req as Request)).rejects.toThrow(ErrorMessages.UnknownError);
        });
    });
});
