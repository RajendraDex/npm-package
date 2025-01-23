import { z } from "zod";
import { DiscountErrors } from "../../enums/errorMessages";

/**
 * Schema for discount creation validation.
 * 
 * This schema validates the input data when creating a discount.
 * It ensures that:
 * - `discountTitle` is a required string with a minimum length of 1.
 * - `discountCode` is a required string with a minimum length of 1.
 * - `discountRate` is a required number that can be a decimal.
 * - `maxInvoiceValue` is a required number that can be a decimal.
 * - `flatDiscount` is a required number that can be a decimal and must not exceed `maxInvoiceValue`.
 * - `occasion` is an optional string that can be null.
 * 
 * Additionally, it checks that the `discountRate` does not exceed 100.
 */
export const discountSchema = z.object({
    discountTitle: z.string().min(1, { message: DiscountErrors.FieldRequired }).max(64, { message: DiscountErrors.MaxLength.replace('field', 'discountTitle').replace('maxLength', '64').replace('type', 'characters') }),
    discountCode: z.string().min(1, { message: DiscountErrors.FieldRequired }).max(50, { message: DiscountErrors.MaxLength.replace('field', 'discountCode').replace('maxLength', '50').replace('type', 'characters') }),
    discountRate: z.number({ message: DiscountErrors.FieldRequired }).refine(value => value % 1 !== 0 || value <= 100, { message: DiscountErrors.InvalidDiscountValue }),
    maxInvoiceValue: z.number({ message: DiscountErrors.FieldRequired }).max(1000000000, { message: DiscountErrors.MaxLength.replace('field', 'maxInvoiceValue').replace('maxLength','10').replace('type', 'digits') }),
    flatDiscount: z.number({ message: DiscountErrors.FieldRequired }).max(1000000000, { message: DiscountErrors.MaxLength.replace('field', 'flatDiscount').replace('maxLength','10').replace('type', 'digits') }),
    occasion: z.string().max(50, { message: DiscountErrors.MaxLength.replace('field', 'occasion').replace('maxLength','50').replace('type', 'characters') }).optional().nullable(),
})

/**
 * Schema for discount update validation.
 * 
 * This schema validates the input data when updating a discount.
 * It ensures that:
 * - `discountTitle` is a required string with a minimum length of 1.
 * - `discountCode` is a required string with a minimum length of 1.
 * - `discountRate` is a required number that can be a decimal.
 * - `maxInvoiceValue` is a required number that can be a decimal.
 * - `flatDiscount` is a required number that can be a decimal and must not exceed `maxInvoiceValue`.
 * - `occasion` is an optional string that can be null.
 * 
 * Additionally, it checks that the `discountRate` does not exceed 100.
 */
export const discountUpdateSchema = z.object({
    discountTitle: z.string().min(1, { message: DiscountErrors.FieldRequired }).max(64, { message: DiscountErrors.MaxLength.replace('field', 'discountTitle').replace('maxLength', '64').replace('type', 'characters') }),
    discountCode: z.string().min(1, { message: DiscountErrors.FieldRequired }).max(50, { message: DiscountErrors.MaxLength.replace('field', 'discountCode').replace('maxLength', '50').replace('type', 'characters') }),
    discountRate: z.number({ message: DiscountErrors.FieldRequired }).refine(value => value % 1 !== 0 || value <= 100, { message: DiscountErrors.InvalidDiscountValue }),
    maxInvoiceValue: z.number({ message: DiscountErrors.FieldRequired }).max(1000000000, { message: DiscountErrors.MaxLength.replace('field', 'maxInvoiceValue').replace('maxLength','10').replace('type', 'digits') }),
    flatDiscount: z.number({ message: DiscountErrors.FieldRequired }).max(1000000000, { message: DiscountErrors.MaxLength.replace('field', 'flatDiscount').replace('maxLength','10').replace('type', 'digits') }),
    occasion: z.string().max(50, { message: DiscountErrors.MaxLength.replace('field', 'occasion').replace('maxLength','50').replace('type', 'characters') }).optional().nullable(),
})
