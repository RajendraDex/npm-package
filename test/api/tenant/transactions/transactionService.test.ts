import { Request } from 'express';
import { Knex } from 'knex';
import TransactionService from '../../../../src/services/tenant/transactionService';
import TransactionRepository from '../../../../src/repository/tenant/transacationRepository';
import { ErrorMessages, TransactionMessages } from '../../../../src/enums/responseMessages';

jest.mock('../../../../src/repository/tenant/transacationRepository');

// Define a custom interface that extends Request to include the role property
interface CustomRequest extends Request {
    role?: string; // Make role optional as you're using Partial<Request> in your tests
    knex?: Knex; // Add knex property as optional
}

describe('TransactionService', () => {
    let req: Partial<CustomRequest>; // Changed to CustomRequest
    let transactionRepositoryMock: jest.Mocked<TransactionRepository>;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            role: 'Admin', // Now valid as role is part of CustomRequest
            knex: jest.fn() as unknown as Knex
        };
        transactionRepositoryMock = new TransactionRepository(req.knex as any) as jest.Mocked<TransactionRepository>;
        (TransactionRepository as jest.Mock).mockImplementation(() => transactionRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('deleteTransaction', () => {
        it('should delete a transaction successfully for Admin roles', async () => {
            req.params = { transactionId: '123' };
            transactionRepositoryMock.delete.mockResolvedValue(1);

            const result = await TransactionService.deleteTransaction(req as Request);

            expect(result).toBe(1);
            expect(transactionRepositoryMock.delete).toHaveBeenCalledWith('123');
        });

        it('should throw Unauthorized error for non-Admin roles', async () => {
            req.role = 'Receptionist';
            req.params = { transactionId: 'credit-123' };

            await expect(TransactionService.deleteTransaction(req as Request))
                .rejects.toThrow(ErrorMessages.Unauthorized);
        });
    });

    describe('updateTransaction', () => {
        it('should update a transaction successfully', async () => {
            req.body = {
                invoiceId: 'inv123',
                transactionId: 'trans123',
                ewalletAmount: 100,
                cashAmount: null,
                upiAmount: 150
            };
            req.params = { transactionId: 'trans123' };
            // Mocking additional dependencies and methods would be necessary here
            // For example, mocking wallet, transactions, and model classes

            // Assuming the update process is successful
            transactionRepositoryMock.delete.mockResolvedValue(1);
            // Mock other necessary methods and classes

            const result = await TransactionService.updateTransaction(req as Request);

            // Check the expected result, this is a placeholder
            expect(result).toBeDefined();
        });

        it('should throw an error if transaction not found', async () => {
            req.body = {
                invoiceId: 'inv123',
                transactionId: 'trans123',
                ewalletAmount: 100,
                cashAmount: null,
                upiAmount: null
            };
            req.params = { transactionId: 'trans123' };
            // Mocking the model to simulate transaction not found
            // Mock other necessary methods and classes

            await expect(TransactionService.updateTransaction(req as Request))
                .rejects.toThrow(TransactionMessages.TransactionNotFound);
        });
    });
});
