import { Request, Response } from 'express';
import TransactionController from '../../../../src/controllers/tenant/transactionController';
import TransactionService from '../../../../src/services/tenant/transactionService';

import { TransactionMessages, ErrorMessages } from '../../../../src/enums/responseMessages';
import { ResponseCodes } from '../../../../src/enums/responseCodes';

jest.mock('../../../../src/services/tenant/transactionService');

describe('TransactionController', () => {
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

    describe('deleteTransaction', () => {
        it('should delete a transaction and return success response', async () => {
            TransactionService.deleteTransaction = jest.fn().mockResolvedValue(null);

            await TransactionController.deleteTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: TransactionMessages.TransactionDeleted,
                code: ResponseCodes.OK,
                data: null,
            });
        });

        it('should handle transaction not found error', async () => {
            TransactionService.deleteTransaction = jest.fn().mockRejectedValue(new Error(TransactionMessages.TransactionNotFound));

            await TransactionController.deleteTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(jsonMock).toHaveBeenCalledWith({
                message: TransactionMessages.TransactionNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null,
            });
        });

        it('should handle internal server error', async () => {
            TransactionService.deleteTransaction = jest.fn().mockRejectedValue(new Error('Some error'));

            await TransactionController.deleteTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.UnknownError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });

    describe('updateTransaction', () => {
        it('should update a transaction and return success response', async () => {
            TransactionService.updateTransaction = jest.fn().mockResolvedValue(null);

            await TransactionController.updateTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.OK);
            expect(jsonMock).toHaveBeenCalledWith({
                message: TransactionMessages.TransactionUpdated,
                code: ResponseCodes.OK,
                data: null,
            });
        });

        it('should handle transaction not found error', async () => {
            TransactionService.updateTransaction = jest.fn().mockRejectedValue(new Error(TransactionMessages.TransactionNotFound));

            await TransactionController.updateTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.NOT_FOUND);
            expect(jsonMock).toHaveBeenCalledWith({
                message: TransactionMessages.TransactionNotFound,
                code: ResponseCodes.NOT_FOUND,
                data: null,
            });
        });

        it('should handle internal server error', async () => {
            TransactionService.updateTransaction = jest.fn().mockRejectedValue(new Error('Some error'));

            await TransactionController.updateTransaction(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(ResponseCodes.INTERNAL_SERVER_ERROR);
            expect(jsonMock).toHaveBeenCalledWith({
                message: ErrorMessages.UnknownError,
                code: ResponseCodes.INTERNAL_SERVER_ERROR,
                data: null,
            });
        });
    });
});
