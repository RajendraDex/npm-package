import PromotionService from '../../../../src/services/tenant/promotionService';
import PromotionFactory from '../../../../src/factories/tenant/promotionFactory';
import { Request } from 'express';
import { formatDate, formatDuration, convertToCamelCase } from '../../../../src/helpers/tenants/formatters';

// Mock PromotionFactory
jest.mock('../../../../src/factories/tenant/promotionFactory');

// Mock helper functions
jest.mock('../../../../src/helpers/tenants/formatters', () => ({
  formatDate: jest.fn(),
  formatDuration: jest.fn(),
  convertToCamelCase: jest.fn()
}));

describe('PromotionService', () => {
  let mockRequest: Partial<Request> & { knex?: any, userInfo?: any };
  let mockPromotionFactory: jest.Mocked<PromotionFactory>;

  beforeEach(() => {
    mockRequest = {
      knex: {},
      body: {},
      params: {},
      query: {},
      userInfo: { id: 1, type: 1 },
    };
    mockPromotionFactory = new PromotionFactory({} as any) as jest.Mocked<PromotionFactory>;
    (PromotionFactory as jest.MockedClass<typeof PromotionFactory>).mockImplementation(() => mockPromotionFactory);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPromotion', () => {
    it('should create a promotion successfully', async () => {
      const mockPromotionData = {
        promotionName: 'Summer Sale',
        promotionTagline: 'Save big on summer items',
        startDate: '2023-06-01',
        offerDuration: '30',
        payPrice: 100,
        getPrice: 50
      };
      mockRequest.body = mockPromotionData;
      const mockCreatedPromotion = { id: 1, ...mockPromotionData };
      mockPromotionFactory.createPromotion.mockResolvedValue(mockCreatedPromotion);

      // Mock the formatDate function
      (formatDate as jest.Mock).mockReturnValue('2023-06-01');

      const result = await PromotionService.createPromotion(mockRequest as Request);

      expect(result).toEqual(mockCreatedPromotion);
      expect(mockPromotionFactory.createPromotion).toHaveBeenCalledWith(expect.objectContaining({
        promotion_name: mockPromotionData.promotionName,
        start_date: '2023-06-01',
        offer_duration: mockPromotionData.offerDuration,
        pay_price: mockPromotionData.payPrice,
        get_price: mockPromotionData.getPrice,
        created_by: 1
      }));
    });
  });

  describe('promotionDetails', () => {
    it('should retrieve promotion details successfully', async () => {
      const mockPromotionDetails = {
        promotionUuid: 'd3fafc79-cf60-4b28-98f5-1852c3f5c3cc',
        promotionName: 'test',
        startDate: new Date('2024-10-10T18:30:00.000Z'),
        offerDuration: 14,
        promotionTagline: 'Save big on summer items',
        payPrice: '1200.00',
        getPrice: '1300.00',
        createdBy: 'Manish Manish',
        offerStatus: 'Active'
      };

      mockPromotionFactory.promotionDetails.mockResolvedValue(mockPromotionDetails);
      (convertToCamelCase as jest.Mock).mockReturnValue(mockPromotionDetails);
      (formatDuration as jest.Mock).mockReturnValue('1 year 2 months');
      (formatDate as jest.Mock).mockReturnValue('2024-10-10');

      const result = await PromotionService.promotionDetails(mockRequest as Request);

      expect(result).toEqual({
        promotionUuid: 'd3fafc79-cf60-4b28-98f5-1852c3f5c3cc',
        promotionName: 'test',
        startDate: '2024-10-10',
        offerDuration: '1 year 2 months',
        promotionTagline: 'Save big on summer items',
        payPrice: '1200.00',
        getPrice: '1300.00',
        createdBy: 'Manish Manish',
        offerStatus: 'Active'
      });
      expect(mockPromotionFactory.promotionDetails).toHaveBeenCalled();
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion successfully', async () => {
      const mockPromotionData = {
        promotionName: 'Winter Sale',
        startDate: '2023-12-01',
        offerDuration: '45',
        payPrice: 150,
        getPrice: 75,
        promotionTagline: 'Save big on winter items'
      };
      const promotionId = '123';
      mockRequest.params = { id: promotionId };
      mockRequest.body = mockPromotionData;
      const mockUpdatedPromotion = { id: promotionId, ...mockPromotionData };
      mockPromotionFactory.updatePromotion.mockResolvedValue(mockUpdatedPromotion);

      const result = await PromotionService.updatePromotion(mockRequest as Request);

      expect(result).toEqual(mockUpdatedPromotion);
      expect(mockPromotionFactory.updatePromotion).toHaveBeenCalledWith(promotionId, expect.any(Object));
    });
  });

  describe('changeStatus', () => {
    it('should change the status of a promotion successfully', async () => {
      const promotionId = '123';
      const status = 'active';
      mockRequest.params = { id: promotionId };
      mockRequest.body = { status };
      const mockStatusChangeResult = { id: promotionId, status };
      mockPromotionFactory.changeStatus.mockResolvedValue(mockStatusChangeResult);

      const result = await PromotionService.changeStatus(mockRequest as Request);

      expect(result).toEqual(mockStatusChangeResult);
      expect(mockPromotionFactory.changeStatus).toHaveBeenCalledWith(promotionId, status);
    });
  });

  describe('promotionList', () => {
    it('should retrieve a list of promotions successfully', async () => {
      const mockPromotions = {
        promotions: [{ id: '123', promotion_name: 'Summer Sale', start_date: new Date('2023-06-01'), offer_duration: '30', pay_price: 100, get_price: 50, offer_status: 1 }],
        totalPages: 1,
        currentPage: 1,
        totalRecords: 1
      };
      mockRequest.query = { page: '1', limit: '10', sortField: 'created_at', sortOrder: 'desc', startDate: '', endDate: '', search: '', status: 'active' };
      mockPromotionFactory.promotionList.mockResolvedValue(mockPromotions);

      const result = await PromotionService.promotionList(mockRequest as Request);

      expect(result).toEqual({
        result: expect.any(Array),
        totalPages: 1,
        currentPage: 1,
        totalRecords: 1
      });
      expect(mockPromotionFactory.promotionList).toHaveBeenCalled();
    });
  });

  describe('applyPromotion', () => {
    it('should apply a promotion to a customer successfully', async () => {
      const mockBody = {
        promotionId: 'promo123',
        customerId: 'cust456'
      };
      mockRequest.body = mockBody;
      const mockRole = 'admin';
      const mockUser = { id: 1, type: 1 };
      mockRequest.userInfo = mockUser;

      // Mock the promotionCustomerLink method to simulate successful promotion application
      mockPromotionFactory.promotionCustomerLink.mockResolvedValue(undefined);

      await expect(PromotionService.applyPromotion(mockRequest as Request)).resolves.toBeUndefined();
      expect(mockPromotionFactory.promotionCustomerLink).toHaveBeenCalledWith({
        body: mockBody,
        role: mockRole,
        user: mockUser
      });
    });

    it('should throw an error if the promotion application fails', async () => {
      const mockError = new Error('Failed to apply promotion');
      mockPromotionFactory.promotionCustomerLink.mockRejectedValue(mockError);

      await expect(PromotionService.applyPromotion(mockRequest as Request)).rejects.toThrow(mockError);
    });
  });
});
