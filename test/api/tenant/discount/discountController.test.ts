import { Request, Response } from 'express';
import DiscountController from '../../../../src/controllers/tenant/discountController';
import DiscountService from '../../../../src/services/tenant/discountService';

import { DiscountMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

jest.mock('../../../../src/services/tenant/discountService');

describe('DiscountController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn(() => ({ json: jsonMock }));
        res = {
            status: statusMock,
        };
    });

    describe('createDiscount', () => {
        it('should create a discount and return success response', async () => {
            DiscountService.createDiscount = jest.fn().mockResolvedValue(null);

            await DiscountController.createDiscount(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.CREATED);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.CreateSuccessful,
                code: ResponseCodes.CREATED,
                data: null,
            });
        });

        it('should handle discount code already exists error', async () => {
            DiscountService.createDiscount = jest.fn().mockRejectedValue(new Error(DiscountMessages.DiscountCodeAlreadyExists));

            await DiscountController.createDiscount(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.CONFLICT);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.DiscountCodeAlreadyExists,
                code: ResponseCodes.CONFLICT,
                data: null,
            });
        });

        it('should handle internal server error', async () => {
            DiscountService.createDiscount = jest.fn().mockRejectedValue(new Error('Some error'));

            await DiscountController.createDiscount(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.InternalServerError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });

    describe('discountDetails', () => {
        it('should retrieve discount details successfully', async () => {
            const mockDetails = { id: 1, code: 'SAVE10' };
            DiscountService.discountDetails = jest.fn().mockResolvedValue(mockDetails);

            await DiscountController.discountDetails(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.FetchSuccessful,
                code: ResponseCodes.OK,
                data: mockDetails,
            });
        });

        it('should handle discount not found error', async () => {
            DiscountService.discountDetails = jest.fn().mockRejectedValue(new Error(DiscountMessages.DiscountNotFound));

            await DiscountController.discountDetails(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.DiscountNotFound,
                code: ResponseCodes.BAD_REQUEST,
                data: null,
            });
        });
    });

    describe('updateDiscount', () => {
        it('should update a discount successfully', async () => {
            DiscountService.updateDiscount = jest.fn().mockResolvedValue(null);

            await DiscountController.updateDiscount(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.UpdateSuccessful,
                code: ResponseCodes.OK,
                data: null,
            });
        });

        it('should handle discount not found error', async () => {
            DiscountService.updateDiscount = jest.fn().mockRejectedValue(new Error(DiscountMessages.DiscountNotFound));

            await DiscountController.updateDiscount(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.BAD_REQUEST);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.DiscountNotFound,
                code: ResponseCodes.BAD_REQUEST,
                data: null,
            });
        });
    });

    describe('discountList', () => {
        it('should retrieve a list of discounts successfully', async () => {
            const mockList = [{ id: 1, code: 'SAVE10' }, { id: 2, code: 'SAVE20' }];
            DiscountService.discountList = jest.fn().mockResolvedValue(mockList);

            await DiscountController.discountList(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: DiscountMessages.FetchSuccessful,
                code: ResponseCodes.OK,
                data: mockList,
            });
        });

        it('should handle internal server error when listing discounts', async () => {
            DiscountService.discountList = jest.fn().mockRejectedValue(new Error('Some error'));

            await DiscountController.discountList(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.UnknownError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });
});
