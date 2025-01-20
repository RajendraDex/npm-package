import { Knex } from 'knex';
import ReportingModel from '../../../../src/models/tenant/reportingModel';
import ReportingFactory from '../../../../src/factories/tenant/reportingFactory';
import Model from '../../../../src/models/generelisedModel';
import { ErrorMessages } from '../../../../src/enums/responseMessages';

// Mock the ReportingModel and Model
jest.mock('../../../../src/models/tenant/reportingModel');
jest.mock('../../../../src/models/generelisedModel');

describe('ReportingFactory', () => {
  let reportingFactory: ReportingFactory;
  let mockDb: Knex;
  let mockReportingModel: jest.Mocked<ReportingModel>;
  let mockGeneralModel: jest.Mocked<Model>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockReportingModel = new ReportingModel(mockDb) as jest.Mocked<ReportingModel>;
    mockGeneralModel = new Model(mockDb) as jest.Mocked<Model>;
    reportingFactory = new ReportingFactory(mockDb);
    (reportingFactory as any).reportingModel = mockReportingModel; // Inject mock ReportingModel
    (reportingFactory as any).generalModel = mockGeneralModel; // Inject mock GeneralModel
  });

  describe('fetchCommissionReport', () => {
    const mockProvider = 'provider1';
    const mockFromDate = '2021-01-01';
    const mockToDate = '2021-01-31';
    const mockSortOrder = 'desc';
    const mockPage = 1;
    const mockLimit = 10;

    it('should fetch commission report successfully', async () => {
      const mockReportData = {
        result: [],
        totalPages: 1,
        currentPage: 1,
        totalCommission: 100,
        commission: 50,
        totalRecords: 5
      };
      mockGeneralModel.select.mockResolvedValue([{ id: '123' }]); // Mock the select method of GeneralModel
      mockReportingModel.fetchCommissionReport.mockResolvedValue(mockReportData); // Mock the fetchCommissionReport method of ReportingModel

      const result = await reportingFactory.fetchCommissionReport(mockProvider, mockFromDate, mockToDate, mockSortOrder, mockPage, mockLimit);

      // Validate the result
      expect(result.totalPages).toBe(1);
      expect(result.currentPage).toBe(1);
      expect(result.totalCommission).toBe('₹100.00');
      expect(result.commission).toBe('₹50.00');
      expect(result.totalRecords).toBe(5);
    });

    it('should throw an error if the report data is incomplete', async () => {
      mockGeneralModel.select.mockResolvedValue([{ id: '123' }]); // Mock the select method of GeneralModel
      mockReportingModel.fetchCommissionReport.mockResolvedValue({}); // Mock the fetchCommissionReport method of ReportingModel with incomplete data

      // Expect an error to be thrown due to incomplete report data
      await expect(reportingFactory.fetchCommissionReport(mockProvider, mockFromDate, mockToDate, mockSortOrder, mockPage, mockLimit))
        .rejects.toThrow(ErrorMessages.UnknownError);
    });
  });
});
