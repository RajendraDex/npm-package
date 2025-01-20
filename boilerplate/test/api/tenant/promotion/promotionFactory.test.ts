import { Knex } from 'knex';
import model from '../../../../src/models/generelisedModel';
import PromotionModel from '../../../../src/models/tenant/promotionModel';
import PromotionFactory from '../../../../src/factories/tenant/promotionFactory';
import { PromotionMessages } from '../../../../src/enums/responseMessages';
import { CustomerMessages } from '../../../../src/enums/responseMessages';

jest.mock('../../../../src/models/generelisedModel');
jest.mock('../../../../src/models/tenant/promotionModel');

describe('PromotionFactory', () => {
    let promotionFactory: PromotionFactory;
    let mockDb: Knex;
    let mockmodel: jest.Mocked<model>;
    let mockPromotionModel: jest.Mocked<PromotionModel>;
    beforeEach(() => {
        mockDb = {} as Knex; // Mock Knex instance
        mockmodel = new model(mockDb) as jest.Mocked<model>;
        mockPromotionModel = new PromotionModel(mockDb) as jest.Mocked<PromotionModel>;
        promotionFactory = new PromotionFactory(mockDb);
        (promotionFactory as any).model = mockmodel; // Inject mock model
    });

    describe('createPromotion', () => {
        const mockPromotionData = {
            promotion_name: 'Summer Sale',
            promotion_tagline: 'Get 50% off on all products',
            start_date: '2024-10-10',
            offer_duration: 30,
            pay_price: 100,
            get_price: 50,
            created_by: 1,
            created_at: new Date(),
            updated_at: new Date()
        };

        it('should create a new promotion successfully', async () => {
            mockmodel.select.mockResolvedValue([]);
            mockmodel.insert.mockResolvedValue([{ promotion_uuid: 'uuid123' }]);

            const result = await promotionFactory.createPromotion(mockPromotionData);

            expect(result);
        });
    });

    describe('promotionDetails', () => {
        const mockPromotionId = 'promo123';

        it('should retrieve promotion details successfully', async () => {
            const mockDetails = {
                promotion_uuid: mockPromotionId,
                promotion_name: 'Winter Sale',
                start_date: new Date(),
                offer_duration: 45,
            };
            mockmodel.select.mockResolvedValue([mockDetails]); // Ensure this line correctly mocks the data

            await promotionFactory.promotionDetails(mockPromotionId);

        });

        it('should throw an error if the promotion is not found', async () => {
            mockmodel.select.mockResolvedValue([]);

            await expect(promotionFactory.promotionDetails(mockPromotionId))
                .rejects.toThrow(PromotionMessages.PromotionNotFound);
        });
    });

    describe('updatePromotion', () => {
        const mockPromotionId = '47fec671-981d-4f6f-bee9-1a270fe10606';
        const mockUpdateData = {
            promotion_name: 'Spring Sale',
        };

        it('should update an existing promotion successfully', async () => {
            mockmodel.select.mockResolvedValueOnce([{ promotion_uuid: mockPromotionId, promotion_name: 'Spring Sale' }]);
            mockmodel.update.mockResolvedValue([{ promotion_uuid: mockPromotionId }]);

            const result = await promotionFactory.updatePromotion(mockPromotionId, { promotion_name: 'Updated Spring Sale' });

            expect(result);
        });

        it('should throw an error if the promotion is not found', async () => {
            mockmodel.select.mockResolvedValue([]);

            await expect(promotionFactory.updatePromotion(mockPromotionId, mockUpdateData))
                .rejects.toThrow(PromotionMessages.PromotionNotFound);
        });
    });

    describe('changeStatus', () => {
        const mockPromotionId = 'promo123';
        const newStatus = 1;

        it('should change the status of a promotion', async () => {
            mockmodel.select.mockResolvedValue([{ id: mockPromotionId }]);
            mockmodel.update.mockResolvedValue([{ promotion_uuid: mockPromotionId }]);

            const result = await promotionFactory.changeStatus(mockPromotionId, newStatus);

            expect(result[0].promotion_uuid).toBe(mockPromotionId);
        });

        it('should throw an error if the promotion is not found', async () => {
            mockmodel.select.mockResolvedValue([]);

            await expect(promotionFactory.changeStatus(mockPromotionId, newStatus))
                .rejects.toThrow(PromotionMessages.PromotionNotFound);
        });
    });

    describe('promotionCustomerLink', () => {
        const mockData = {
            body: {
                customerId: 'cust123',
                promotionId: 'promo123',
                purchaseDate: '2024-01-01'
            },
            role: 'admin',
            user: {
                id: 'user123'
            }
        };

        it('should throw an error if the customer is not found', async () => {
            mockmodel.select.mockResolvedValueOnce([]); // Simulate no customer found

            await expect(promotionFactory.promotionCustomerLink(mockData))
                .rejects.toThrow(CustomerMessages.CustomerNotFound);
        });

        it('should throw an error if the promotion is already availed', async () => {
            mockmodel.select
                .mockResolvedValueOnce([{ id: 1 }]) // Simulate customer found
                .mockResolvedValueOnce([{ id: 1, expiry_date: new Date('2025-01-01') }]); // Simulate existing promotion link

            await expect(promotionFactory.promotionCustomerLink(mockData))
                .rejects.toThrow(PromotionMessages.AlreadyAvaildPromotion);
        });

        it('should link a promotion to a customer successfully', async () => {
            mockmodel.select
                .mockResolvedValueOnce([{ id: 1 }]) // Simulate customer found
                .mockResolvedValueOnce([]) // No existing promotion link
                .mockResolvedValueOnce([{ id: 1, pay_price: 100, get_price: 50, offer_duration: 30, start_date: new Date('2024-01-01') }]); // Promotion details
            mockmodel.insert.mockResolvedValue([{ id: 1 }]); // Simulate successful link creation

            const result = await promotionFactory.promotionCustomerLink(mockData);

            expect(result).toBeTruthy();
        });
    });
});
