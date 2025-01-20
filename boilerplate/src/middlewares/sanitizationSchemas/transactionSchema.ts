import { z } from 'zod';
import { TransactionErrors } from '../../enums/errorMessages';

/**
 * Schema for updating a transaction.
 * 
 * This schema validates the input data when updating a transaction.
 * It ensures that:
 * - `transactionId` is a required string with at least 1 character.
 * - `invoiceId` is a required string with at least 1 character.
 * - `walletAmount`, `cashAmount`, and `upiAmount` are optional numbers.
 * Additionally, it ensures that at least one of `walletAmount`, `cashAmount`, or `upiAmount` is provided.
 */
export const updateTransactionSchema = z.object({
  transactionId: z.string().nullable(),
    invoiceId: z.string().min(1, TransactionErrors.InvoiceIdRequired),
    ewalletAmount: z.number().optional().nullable(),
    cashAmount: z.number().optional().nullable(),
    upiAmount: z.number().optional().nullable()
}).refine((data) => {
    return data.ewalletAmount || data.cashAmount || data.upiAmount;
}, {
        message: TransactionErrors.FieldRequired
    }) ;
