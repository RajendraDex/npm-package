import { Request } from 'express';
import DiscountService from '../../../../src/services/tenant/discountService';
import DiscountFactory from '../../../../src/factories/tenant/discountFactory';

jest.mock('../../../../src/factories/tenant/discountFactory');

describe('DiscountService', () => {
    let req: Partial<Request>;
    let discountFactoryMock: jest.Mocked<DiscountFactory>;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {},
            headers: {}
        };
        const knex = jest.fn();
        discountFactoryMock = new DiscountFactory(knex as any) as jest.Mocked<DiscountFactory>;
        (DiscountFactory as jest.Mock).mockImplementation(() => discountFactoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createDiscount', () => {
        it('should create a discount successfully', async () => {
            req.body = {
                discountCode: 'DISC10',
                discountTitle: '10% Off',
                discountRate: 10,
                maxInvoiceValue: 5000,
                flatDiscount: 500
            };
            discountFactoryMock.createDiscount.mockResolvedValue({
                id: 1,
                discount_code: 'DISC10',
                discount_title: '10% Off',
                discount_rate: '10%',
                max_invoice_amount: '₹5000',
                flat_discount: '₹500',
                created_by: 1,
                occasion: 'New Year',
                created_at: new Date(),
                updated_at: new Date()
            });

            const result = await DiscountService.createDiscount(req as Request);

            expect(result).toEqual({
                id: 1,
                discountCode: 'DISC10',
                discountTitle: '10% Off',
                discountRate: '10%',
                maxInvoiceValue: '₹5000',
                flatDiscount: '₹500',
                createdBy: 1,
                occasion: 'New Year',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(discountFactoryMock.createDiscount).toHaveBeenCalledWith({
                discount_code: 'DISC10',
                discount_title: '10% Off',
                discount_rate: 10,
                max_invoice_amount: 5000,
                flat_discount: 500,
                created_by: 1,
                occasion: 'New Year',
                created_at: expect.any(Date),
                updated_at: expect.any(Date)
            });
        });

        it('should throw an error if discount creation fails', async () => {
            req.body = {
                discountCode: 'DISC10',
                discountTitle: '10% Off',
                discountRate: 10,
                maxInvoiceValue: 5000,
                flatDiscount: 500
            };
            discountFactoryMock.createDiscount.mockRejectedValue(new Error('Failed to create discount'));

            await expect(DiscountService.createDiscount(req as Request)).rejects.toThrow('Failed to create discount');
        });
    });

    describe('updateDiscount', () => {
        it('should update a discount successfully', async () => {
            req.params = { id: '1' };
            req.body = {
                discountCode: 'DISC20',
                discountTitle: '20% Off',
                discountRate: 15,
                maxInvoiceValue: 10000,
                flatDiscount: 1000
            };
            discountFactoryMock.updateDiscount.mockResolvedValue({
                id: '1',
                discount_code: 'DISC20',
                discount_title: '20% Off',
                discount_rate: 15,
                max_invoice_amount: 10000,
                flat_discount: 1000,
                updated_at: new Date()
            });

            const result = await DiscountService.updateDiscount(req as Request);

            expect(result).toEqual({
                id: 1,
                discountCode: 'DISC20',
                discountTitle: '20% Off',
                discountRate: 15,
                maxInvoiceValue: 10000,
                flatDiscount: 1000,
                updatedAt: expect.any(Date)
            });
            expect(discountFactoryMock.updateDiscount).toHaveBeenCalledWith('1', {
                discount_code: 'DISC20',
                discount_title: '20% Off',
                discount_rate: 15,
                max_invoice_amount: 10000,
                flat_discount: 1000,
                updated_at: expect.any(Date)
            });
        });

        it('should throw an error if discount update fails', async () => {
            req.params = { id: '1' };
            discountFactoryMock.updateDiscount.mockRejectedValue(new Error('Failed to update discount'));

            await expect(DiscountService.updateDiscount(req as Request)).rejects.toThrow('Failed to update discount');
        });
    });

    describe('discountDetails', () => {
        it('should retrieve discount details successfully', async () => {
            req.params = { id: '1' };
            discountFactoryMock.discountDetails.mockResolvedValue({
                id: '1',
                discount_code: 'DISC10',
                discount_title: '10% Off',
                discount_rate: 10,
                max_invoice_amount: 5000,
                flat_discount: 500,
                occasion: 'New Year',
                created_at: new Date(),
                updated_at: new Date()
            });

            const result = await DiscountService.discountDetails(req as Request);

            expect(result).toEqual({
                id: '1',
                discountCode: 'DISC10',
                discountTitle: '10% Off',
                discountRate: '10%',
                maxInvoiceValue: '₹5000',
                flatDiscount: '₹500',
                occasion: 'New Year',
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
            expect(discountFactoryMock.discountDetails).toHaveBeenCalledWith('1');
        });

        it('should throw an error if discount details retrieval fails', async () => {
            req.params = { id: '1' };
            discountFactoryMock.discountDetails.mockRejectedValue(new Error('Failed to retrieve discount details'));

            await expect(DiscountService.discountDetails(req as Request)).rejects.toThrow('Failed to retrieve discount details');
        });
    });

    describe('discountList', () => {
        it('should return a paginated list of discounts', async () => {
            req.query = {
                page: '1',
                limit: '10',
                sortBy: 'created_at',
                sortOrder: 'desc',
                search: '',
                occasion: 'New Year'
            };
            discountFactoryMock.discountList.mockResolvedValue({
                results: [{
                    id: 'uuid_1',
                    discount_code: 'DISC10',
                    discount_rate: 10,
                    discount_title: '10% Off',
                    max_invoice_amount: 5000,
                    flat_discount: 500,
                    created_at: new Date(),
                    updated_at: new Date()
                }],
                totalPages: 1,
                currentPage: 1,
                totalRecords: 1
            });

            const result = await DiscountService.discountList(req as Request);

            expect(result).toEqual({
                results: [{
                    id: 'uuid_1',
                    discountCode: 'DISC10',
                    discountRate: 10,
                    discountTitle: '10% Off',
                    maxInvoiceValue: '₹5000',
                    flatDiscount: '₹500',
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }],
                totalPages: 1,
                currentPage: 1
            });
            expect(discountFactoryMock.discountList).toHaveBeenCalledWith(1, 10, '', 'created_at', 'desc', 'New Year');
        });

        it('should throw an error if discount list retrieval fails', async () => {
            req.query = {
                page: '1',
                limit: '10',
                sortBy: 'created_at',
                sortOrder: 'desc',
                search: '',
                occasion: 'New Year'
            };
            discountFactoryMock.discountList.mockRejectedValue(new Error('Failed to retrieve discount list'));

            await expect(DiscountService.discountList(req as Request)).rejects.toThrow('Failed to retrieve discount list');
        });
    });
});
