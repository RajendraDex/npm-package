import { z } from 'zod';
import { InvoiceErrors } from '../../enums/errorMessages';

/**
 * Schema for creating an invoice.
 * 
 * This schema validates the input data when creating an invoice.
 * It ensures that:
 * - `serviceDate` is a required string in date format.
 * - `customerId` is an optional string (UUID format) when customer exists.
 * - `customerData` is an optional object when customer does not exist, containing:
 *   - `firstName`: A required string.
 *   - `lastName`: A required string.
 *   - `gender`: A required string, either 'm', 'f', or 'other'.
 *   - `email`: A required string in email format.
 *   - `phoneNumber`: A required string.
 *   - `countryCode`: A required string.
 * - `invoiceServices` is a required array of objects, each containing:
 *   - `providerId`: A required string (UUID format).
 *   - `serviceId`: A required string (UUID format).
 *   - `quantity`: A required positive integer.
 *   - `price`: A required positive number.
 *   - `totalPrice`: A required positive number.
 *   - `id`: A required positive integer.
 */
export const createInvoiceSchema = z.object({
  serviceDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  customerId: z.string().uuid().optional().nullable(),
  bookingId: z.union([z.string().uuid(), z.literal('')]).optional().nullable(),
  customerData: z.object({
    firstName: z.string().min(1, InvoiceErrors.FieldRequired),
    lastName: z.string().nullable().optional(),
    gender: z.enum(['m', 'f', 'o']),
    email: z.string().nullable(),
    phoneNumber: z.string().min(1,  InvoiceErrors.FieldRequired),
    countryCode: z.string().min(1,  InvoiceErrors.FieldRequired),
  }).optional().nullable(),
  invoiceServices: z.array(
    z.object({
      providerId: z.string().uuid(),
      serviceId: z.string().uuid(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      totalPrice: z.number().positive(),
    })
  ),
  payment: z.object({
    ewalletAmount: z.number().optional().nullable(),
    cashAmount: z.number().optional().nullable(),
    upiAmount: z.number().optional().nullable(),
  }).optional().nullable(),
});