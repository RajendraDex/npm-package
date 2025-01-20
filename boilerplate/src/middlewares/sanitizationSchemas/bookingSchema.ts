import { z } from 'zod';
import { InvoiceErrors } from '../../enums/errorMessages';

/**
 * Schema for creating a booking.
 * 
 * This schema validates the input data when creating a booking.
 * It ensures that:
 * - `firstName` and `lastName` are required strings.
 * - `gender` is a required string, either 'm', 'f', or 'o'.
 * - `emailId` is a required string in email format.
 * - `service` is a required array of UUID strings.
 * - `provider` is a required UUID string.
 * - `phoneNumber` and `countryCode` are required strings.
 * - `date` is a required string in date format.
 * - `time` is a required string.
 * - `bookingType` is a required integer.
 * - `customerId` is an optional UUID string, can be null.
 */
export const createBookingSchema = z.object({
  firstName: z.string().min(1, InvoiceErrors.FieldRequired),
  lastName: z.string().optional().nullable(),
  gender: z.enum(['m', 'f', 'o']),
  emailId: z.string().nullable().optional(),
  service: z.array(z.string().uuid()).nullable().optional(),
  provider: z.string().uuid().optional().nullable(),
  phoneNumber: z.string().min(1, InvoiceErrors.FieldRequired),
  countryCode: z.string().min(1, InvoiceErrors.FieldRequired),
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  time: z.string().min(1, InvoiceErrors.FieldRequired),
  bookingType: z.number().int().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
  addressId: z.number().optional().nullable(),
});

/**
 * Schema for updating a booking.
 * 
 * This schema validates the input data when updating a booking.
 * It ensures that all fields are optional.
 */
export const updateBookingSchema = z.object({
  firstName: z.string().min(1, InvoiceErrors.FieldRequired).optional(),
  lastName: z.string().optional().nullable(),
  gender: z.enum(['m', 'f', 'o']).optional(),
  emailId: z.string().nullable().optional(),
  service: z.array(z.string().uuid()).nullable().optional(),
  provider: z.string().uuid().optional().nullable(),
  phoneNumber: z.string().min(1, InvoiceErrors.FieldRequired).optional(),
  countryCode: z.string().min(1, InvoiceErrors.FieldRequired).optional(),
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  time: z.string().min(1, InvoiceErrors.FieldRequired),
  bookingType: z.number().int().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
  addressId: z.number().optional().nullable(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'complete', 'cancel']),
});
