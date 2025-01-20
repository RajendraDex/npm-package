import { z } from 'zod';
import { PrivilegeErrors } from '../../enums/errorMessages';

// Define an enum for allowed operations
const PermissionOperations = z.enum(['create', 'read', 'update', 'delete']);

/**
 * Schema for creating a new permission.
 * 
 * This schema validates the input data when creating a new permission.
 * It ensures that:
 * - `permissionName` is a required non-empty string.
 * - `permissionDescription` is a required non-empty string.
 * - `permissionOperations` is a non-empty array of allowed operations.
 * - `createdBy` is a required positive integer representing the creator's ID.
 */
export const createPermissionSchema = z.object({
  permissionName: z.string().min(1, PrivilegeErrors.FieldRequired), // Ensure the name is a non-empty string
  permissionDescription: z.string().min(1, PrivilegeErrors.FieldRequired), // Ensure description is a non-empty string
  permissionOperations: z.array(PermissionOperations).nonempty(PrivilegeErrors.FieldRequired), // Ensure it's a non-empty array of allowed operations
  createdBy: z.number().int().positive(PrivilegeErrors.FieldRequired) // Ensure it's a positive integer
});

/**
 * Schema for updating an existing permission.
 * 
 * This schema validates the input data when updating a permission.
 * It ensures that:
 * - `permissionId` is a required positive integer representing the permission ID to update.
 * - `updateData` is an object containing optional fields:
 *   - `permissionName`: A string to update the permission name.
 *   - `permissionDescription`: A string to update the permission description.
 *   - `permissionOperations`: An array of allowed operations to update the existing operations.
 * 
 * The `partial()` method ensures that all fields in `updateData` are optional.
 */
export const updatePermissionSchema = z.object({
  permissionId: z.number().int().positive(PrivilegeErrors.FieldRequired), // Ensure it's a positive integer
  updateData: z.object({
    permissionName: z.string().optional(), // Optional field, if not provided, the existing name will be retained
    permissionDescription: z.string().optional(), // Optional field, if not provided, the existing description will be retained
    permissionOperations: z.array(PermissionOperations).optional(), // Optional field, if not provided, the existing operations will be retained
  }).partial() // Make all fields in updateData optional
});

/**
 * Schema for updating multiple permissions at once.
 * 
 * This schema validates an array of `updatePermissionSchema` objects,
 * ensuring that each item in the array follows the rules defined in `updatePermissionSchema`.
 */
export const updateMultiplePermissionsSchema = z.array(updatePermissionSchema);
