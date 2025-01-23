import { z } from 'zod';
import { ServiceErrors } from '../../enums/errorMessages';

/**
 * Schema for creating a new service.
 * 
 * This schema validates the input data when creating a new service.
 * It ensures that:
 * - `serviceName` is a required string with at least 1 character.
 * - `serviceDescription` is a required string.
 * - `servicePrice` is a required number.
 * - `serviceCategoryIds` is a required array of numbers.
 * - `serviceImage` is a required array of strings representing URLs.
 * - `serviceDuration` is a required number.
 */
export const createServiceSchema = z.object({
  serviceName: z.string().min(1, ServiceErrors.ServiceNameRequired),
  serviceDescription: z.string().optional().nullable(),
  servicePrice: z.number().positive(ServiceErrors.ServicePriceRequired),
  serviceCategoryIds: z.array(z.string()).nonempty(ServiceErrors.ServiceCategoryIdsRequired),
  serviceImage: z.array(z.string().optional().nullable()),
  serviceDuration: z.number().positive(ServiceErrors.ServiceDurationRequired),
});

/**
 * Schema for updating an existing service.
 * 
 * This schema validates the input data when updating a service.
 * It allows:
 * - `serviceName` to be an optional string.
 * - `serviceDescription` to be an optional string.
 * - `servicePrice` to be an optional number.
 * - `serviceCategoryIds` to be an optional array of numbers.
 * - `serviceImage` to be an optional array of strings representing URLs.
 * - `serviceDuration` to be an optional number.
 */
export const updateServiceSchema = z.object({
  serviceName: z.string().optional(),
  serviceDescription: z.string().optional().nullable(),
  servicePrice: z.number().positive().optional(),
  serviceCategoryIds: z.array(z.string()).optional(),
  serviceImage: z.array(z.string()).optional().nullable(),
  serviceDuration: z.number().positive().optional(),
});

/**
 * Schema for updating the status of a service.
 * 
 * This schema validates the input data when updating the status of a service.
 * It ensures that:
 * - `status` is either 0 or 1.
 */
export const serviceStatusSchema = z.object({
  status: z.union([z.literal(0), z.literal(1),z.literal(2)], { message: ServiceErrors.StatusZeroOrOne })
});


export const serviceDeleteSchema = z.object({
  isDeleted: z.union([z.literal(0), z.literal(1)], { message: ServiceErrors.StatusZeroOrOne })
})