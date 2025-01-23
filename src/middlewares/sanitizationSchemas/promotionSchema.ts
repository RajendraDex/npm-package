import { nullable, z } from 'zod';
import { PromotionErrors } from '../../enums/errorMessages';

/**
 * Schema for creating a promotion.
 * 
 * This schema validates the input data when creating a promotion.
 * It ensures that:
 * - `promotionName` is a required string with a minimum length of 1.
 * - `startDate` is a required string that must be a valid date format.
 * - `offerDuration` is a required number with a minimum value of 1.
 * - `payPrice` is a required number with a minimum value of 1.
 * - `getPrice` is a required number with a minimum value of 1 and must be greater than `payPrice`.
 */
export const createPromotionSchema = z.object({
    promotionName: z.string().min(1, { message: PromotionErrors.FieldRequired }).max(45, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '45') }),
    startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: PromotionErrors.InvalidDate,
    }),
    offerDuration: z.number().min(1, { message: PromotionErrors.FieldRequired }),
    offerStatus: z.string().optional().nullable().refine(status => status === "Active" || status === "Inactive" || status === null || status === undefined || status === "", { message: PromotionErrors.InvalidStatus }),
    promotionTagline: z.string().max(300, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '300') }).optional().nullable(),
    payPrice: z.number().min(1, { message: PromotionErrors.FieldRequired }).max(1000000000, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '10') }),
    getPrice: z.number().min(1, { message: PromotionErrors.FieldRequired }).max(1000000000, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '10') }),
    customers: z.array(z.object({
        customerId: z.string().min(1, { message: PromotionErrors.FieldRequired }),
        purchaseDate: z.string().refine(date => !isNaN(Date.parse(date)), {
            message: PromotionErrors.InvalidDate,
        }),
    })).optional().nullable(),
}).refine((data: any) => {
    return data.getPrice > data.payPrice;
}, { message: PromotionErrors.GetPriceLessThanPayPrice })

/**
 * Schema for updating a promotion.
 * 
 * This schema validates the input data when updating a promotion.
 * It ensures that:
 * - `promotionName` is an optional string with a minimum length of 1.
 * - `startDate` is an optional string that must be a valid date format.
 * - `offerDuration` is an optional number with a minimum value of 1.
 * - `payPrice` is an optional number with a minimum value of 1.
 * - `getPrice` is an optional number with a minimum value of 1 and must be greater than `payPrice` if both are provided.
 * 
 * Additionally, it checks that if both `payPrice` and `getPrice` are provided, `getPrice` must be greater than `payPrice`.
 */
export const updatePromotionSchema = z.object({
    promotionName: z.string().min(1, { message: PromotionErrors.FieldRequired }).max(45, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '45') }).optional(),
    startDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: PromotionErrors.InvalidDate,
    }).optional(),
    offerStatus: z.string().optional().nullable().refine(status => status === "Active" || status === "Inactive" || status === null || status === undefined || status === "", { message: PromotionErrors.InvalidStatus }),
    offerDuration: z.number().min(1, { message: PromotionErrors.FieldRequired }).optional(),
    promotionTagline: z.string().max(300, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '300') }).optional().nullable(),
    payPrice: z.number().min(1, { message: PromotionErrors.FieldRequired }).max(1000000000, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '10') }).optional(),
    getPrice: z.number().min(1, { message: PromotionErrors.FieldRequired }).max(1000000000, { message: PromotionErrors.MaximumSizeExceeded.replace('{size}', '10') }).optional(),
    customers: z.array(z.object({
        linkId: z.number().optional().nullable(),
        customerId: z.string().min(1, { message: PromotionErrors.FieldRequired }),
        purchaseDate: z.string().refine(date => !isNaN(Date.parse(date)), {
            message: PromotionErrors.InvalidDate,
        }),
    })).optional().nullable(),
}).refine((data: any) => {
    if (data.payPrice !== undefined && data.getPrice !== undefined) {
        return data.getPrice > data.payPrice;
    }
    return true;
}, { message: PromotionErrors.GetPriceLessThanPayPrice })

/**
 * Schema for changing the status of a promotion.
 * 
 * This schema validates the input data when changing the status of a promotion.
 * It ensures that:
 * - `status` is a number that must be either 0 or 1.
 */
export const changeStatusSchema = z.object({
    status: z.string()
}).refine((data: { status: string }) => {
    return data.status === 'Inactive' || data.status === 'Active';
}, { message: PromotionErrors.InvalidStatus })

/**
 * Schema for applying a promotion.
 * 
 * This schema validates the input data when applying a promotion.
 * It ensures that:
 * - `promotionId` is a required string with a minimum length of 1.
 * - `customerId` is a required string with a minimum length of 1.
 * - `purchaseDate` is an optional string that must be a valid date format if provided.
 */
export const applyPromotionSchema = z.object({
    // The unique identifier for the promotion, required and must be at least 1 character long
    promotionId: z.string().min(1, { message: PromotionErrors.FieldRequired }),

    // The unique identifier for the customer, required and must be at least 1 character long
    customerId: z.string().min(1, { message: PromotionErrors.FieldRequired }),
    // The date of purchase, required and must be a valid date format
    purchaseDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: PromotionErrors.InvalidDate,
    }),
});
