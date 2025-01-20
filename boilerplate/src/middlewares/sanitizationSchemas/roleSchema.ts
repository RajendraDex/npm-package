// src/schemas/roleSchema.ts

import { z } from 'zod';
import { RoleErrors } from '../../enums/errorMessages';

/**
 * Schema for creating a new role.
 * 
 * This schema validates the input data when creating a new role.
 * It ensures that:
 * - `roleName` is a required string with at least 1 character.
 * - `roleDescription` is an optional string.
 * - `rolePermissions` is an array of objects, each containing:
 *   - `permission_id`: A positive integer representing the permission ID.
 *   - `permission_operations`: An array of enum values ('create', 'read', 'update', 'delete') representing allowed operations.
 */
export const createRoleSchema = z.object({
  roleName: z.string().min(1, RoleErrors.RoleNameRequired),
  roleDescription: z.string().optional(),
  grants: z.array(
    z.object({
      id: z.number().int().positive(),
       actions: z.array(z.enum(['create', 'read', 'update', 'delete'])),
    })
  ),
});

/**
 * Schema for updating an existing role.
 * 
 * This schema validates the input data when updating a role.
 * It allows:
 * - `roleName` to be an optional string.
 * - `roleDescription` to be an optional string.
 * - `rolePermissions` to be an optional array of objects, each containing:
 *   - `permission_id`: A positive integer representing the permission ID.
 *   - `permission_operations`: An array of enum values ('create', 'read', 'update', 'delete') representing allowed operations.
 */
export const updateRoleSchema = z.object({
  roleName: z.string().optional(),
  roleDescription: z.string().optional(),
  grants: z.array(
    z.object({
      id: z.number().int().positive(),
      actions: z.array(z.enum(['create', 'read', 'update', 'delete'])),
    })
  ).optional(),
});