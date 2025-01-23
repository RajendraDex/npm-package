import { Knex } from 'knex';
import DiscountFactory from '../../../../src/factories/tenant/discountFactory';
import Model from '../../../../src/models/generelisedModel';
import discountModel from '../../../../src/models/tenant/discountModel';
import { DiscountMessages } from '../../../../src/enums/responseMessages';

// Mock the necessary models
jest.mock('../../../../src/models/generelisedModel');
jest.mock('../../../../src/models/tenant/discountModel');

describe('DiscountFactory', () => {
  let discountFactory: DiscountFactory;
  let mockDb: Knex;
  let mockModel: jest.Mocked<Model>;
  let mockDiscountModel: jest.Mocked<discountModel>;

  beforeEach(() => {
    mockDb = {} as Knex; // Mock Knex instance
    mockModel = new Model(mockDb) as jest.Mocked<Model>;
    mockDiscountModel = new discountModel(mockDb) as jest.Mocked<discountModel>;
    discountFactory = new DiscountFactory(mockDb);
    (discountFactory as any).Model = mockModel; // Inject mock Model
    (discountFactory as any).discountModel = mockDiscountModel; // Inject mock discountModel
  });

  describe('createDiscount', () => {
    const mockDiscountData = {
      discount_title: '10% Off',
      discount_code: 'SAVE10',
      discount_rate: 10,
      max_invoice_amount: 5000,
      flat_discount: 500,
      occasion: 'New Year'
    };

    it('should create a new discount successfully', async () => {
      mockModel.select.mockResolvedValue([]);
      mockModel.insert.mockResolvedValue({ discount_uuid: 'uuid123' });

      const result = await discountFactory.createDiscount(mockDiscountData);

      expect(result).toHaveProperty('discount_uuid', 'uuid123');
    });

    it('should throw an error if discount code already exists', async () => {
      mockModel.select.mockResolvedValue([{ id: 1 }]);

      await expect(discountFactory.createDiscount(mockDiscountData))
        .rejects.toThrow(DiscountMessages.DiscountCodeAlreadyExists);
    });
  });

  describe('discountDetails', () => {
    const mockDiscountId = 'uuid123';

    it('should retrieve discount details successfully', async () => {
      mockModel.select
        .mockResolvedValueOnce([{ discount_uuid: mockDiscountId, created_by: 'user1' }])
        .mockResolvedValueOnce([{ first_name: 'John', last_name: 'Doe' }]);

      const result = await discountFactory.discountDetails(mockDiscountId);

      expect(result.created_by).toBe('John Doe');
    });

    it('should throw an error if discount is not found', async () => {
      mockModel.select.mockResolvedValue([]);

      await expect(discountFactory.discountDetails(mockDiscountId))
        .rejects.toThrow(DiscountMessages.DiscountNotFound);
    });
  });

  describe('updateDiscount', () => {
    const mockDiscountId = 'uuid123';
    const mockUpdateData = {
      discount_code: 'UPDATE10',
      discount_rate: 20,
      max_invoice_amount: 10000,
      flat_discount: 1000
    };
    it('should throw an error if discount is not found', async () => {
      mockModel.select.mockResolvedValue([]);

      await expect(discountFactory.updateDiscount(mockDiscountId, mockUpdateData))
        .rejects.toThrow(DiscountMessages.DiscountNotFound);
    });

    it('should throw an error if new discount code already exists', async () => {
      mockModel.select.mockResolvedValueOnce([{ id: 1, discount_uuid: mockDiscountId, discount_code: 'DIFFERENT' }]);
      mockModel.select.mockResolvedValueOnce([{ id: 2 }]); // Different discount with the same code

      await expect(discountFactory.updateDiscount(mockDiscountId, mockUpdateData))
        .rejects.toThrow(DiscountMessages.DiscountCodeAlreadyExists);
    });
  });

  describe('discountList', () => {
    const mockPage = 1;
    const mockLimit = 10;
    const mockSearchQuery = 'summer';
    const mockSortBy = 'created_at';
    const mockSortOrder = 'desc';
    const mockOccasion = 'Christmas';

    it('should retrieve a list of discounts successfully', async () => {
      mockDiscountModel.fetchDiscounts.mockResolvedValue({
        results: [{
          discount_uuid: 'uuid123',
          discount_code: 'SAVE10',
          discount_title: '10% off',
          discount_type: 'Percentage',
          occasion: 'Christmas'
        }],
        totalPages: 1,
        currentPage: 1,
        totalRecords: 1 
      });

      const result = await discountFactory.discountList(mockPage, mockLimit, mockSearchQuery, mockSortBy, mockSortOrder, mockOccasion);

      expect(result).toHaveProperty('results');
    });

    it('should handle database errors', async () => {
      mockDiscountModel.fetchDiscounts.mockRejectedValue(new Error('Database error'));

      await expect(discountFactory.discountList(mockPage, mockLimit, mockSearchQuery, mockSortBy, mockSortOrder, mockOccasion))
        .rejects.toThrow('Database error');
    });
  });

});
