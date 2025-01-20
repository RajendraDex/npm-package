import { z } from 'zod';
import { CategoryErrors } from '../../enums/errorMessages';
/**
 * Schema for creating a new category.
 * 
 * This schema validates the input data when creating a new category.
 * It ensures that:
 * - `categoryName` is a required string with at least 1 character.
 * - `categoryDescription` is an optional string.
 * - `categoryImage` is an optional string representing a URL.
 * - `parentId` is an optional nullable number.
 */
export const createCategorySchema = z.object({
  categoryName: z.string().min(1,CategoryErrors.CatgoryNameRequired),
  categoryDescription: z.string().optional(),
  categoryImage: z.string().optional().nullable(),
  parentId: z.string().nullable().optional(),
});

/**
 * Schema for updating an existing category.
 * 
 * This schema validates the input data when updating a category.
 * It allows:
 * - `categoryName` to be an optional string.
 * - `categoryDescription` to be an optional string.
 * - `categoryImage` to be an optional string representing a URL.
 * - `parentId` to be an optional nullable number.
 */
export const updateCategorySchema = z.object({
  categoryName: z.string().optional(),
  categoryDescription: z.string().optional(),
  categoryImage: z.string().optional().nullable(),
  parentId: z.string().nullable().optional(),
});

/**
 * Schema for updating the status of a category.
 * 
 * This schema validates the input data when changing the status of a category.
 * It ensures that:
 * - `status` is a required value that can only be 0, 1, or 2.
 */
export const categoryStatusSchema = z.object({
    status: z.union([z.literal(0), z.literal(1), z.literal(2)], { message: CategoryErrors.StatusZeroOrOne })
})

/**
 * Schema for deleting a category.
 * 
 * This schema validates the input data when deleting a category.
 * It ensures that:
 * - `isDeleted` is a required value that can only be 0 or 1.
 */
export const categoryDeleteSchema = z.object({
  isDeleted: z.union([z.literal(0), z.literal(1)], { message: CategoryErrors.StatusZeroOrOne })
})