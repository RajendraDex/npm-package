
import { Router } from 'express';
import PermissionController from '../../controllers/auth/permissionController';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
import { createPermissionSchema, updateMultiplePermissionsSchema, updatePermissionSchema } from '../../middlewares/sanitizationSchemas/permissionSchema';

const router = Router();

// Create a new permission
/**
 * @swagger
 * /api/permissions/create:
 *   post:
 *     summary: Create Permission API
 *     description: Creates a new permission with the provided details.
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: "application/json"
 *         required: true
 *         description: The content type of the request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionName:
 *                 type: string
 *                 example: "ManageUsers"
 *                 description: The name of the permission.
 *               permissionDescription:
 *                 type: string
 *                 example: "Permission to manage user accounts"
 *                 description: A description of what the permission allows.
 *               permissionOperations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["create", "update", "delete"]
 *                 description: List of operations allowed by this permission.
 *               createdBy:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the user who is creating this permission.
 *             required:
 *               - permissionName
 *               - permissionOperations
 *               - createdBy
 *     responses:
 *       201:
 *         description: Permission created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Permission created successfully.
 *                 data:
 *                   type: object
 *                   description: The created permission object.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "invalid_type"
 *                       expected:
 *                         type: string
 *                         example: "string"
 *                       received:
 *                         type: string
 *                         example: "number"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["permissionName"]
 *                       message:
 *                         type: string
 *                         example: "Expected string, received number"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       409:
 *         description: Permission with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: Permission already exists.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

router.post('/create', verifyRolePermissions,sanitizeMiddleware, validateMiddleware(createPermissionSchema), PermissionController.createPermission);

/**
 * @swagger
 * /api/permissions/list:
 *   get:
 *     summary: Permission List API
 *     description: Returns a list of role permission
 *     tags:
 *       - Permissions
  *     parameters:
 *       - in: header
 *         name: x-custom-header
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: false
 *         description: A custom header for the request
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/list', verifyRolePermissions, PermissionController.getPermissions);


/**
 * @swagger
 * /api/permissions/update:
 *   put:
 *     summary: Update Permission API
 *     description: Updates an existing permission with the provided data.
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the permission to update.
 *               updateData:
 *                 type: object
 *                 properties:
 *                   permissionOperations:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["read", "create", "update", "delete"]
 *                     description: List of operations allowed by this permission.
 *             required:
 *               - permissionId
 *               - updateData
 *     responses:
 *       200:
 *         description: Successfully updated the permission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Permission updated successfully.
 *                 data:
 *                   type: object
 *                   description: The updated permission object.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "invalid_type"
 *                       expected:
 *                         type: string
 *                         example: "number"
 *                       received:
 *                         type: string
 *                         example: "string"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["permissionId"]
 *                       message:
 *                         type: string
 *                         example: "Expected number, received string"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 * 
 *       404:
 *         description: Permission not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Permission not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */


router.put('/update',verifyRolePermissions, sanitizeMiddleware, validateMiddleware(updatePermissionSchema), PermissionController.updatePermission);

// Update multiple permissions
/**
 * @swagger
 * /api/permissions/update-multiple:
 *   put:
 *     summary: Update Multiple Permissions API
 *     description: Updates multiple permissions with the provided data.
 *     tags:
 *       - Permissions
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 permissionId:
 *                   type: integer
 *                   example: 6
 *                   description: ID of the permission to update.
 *                 updateData:
 *                   type: object
 *                   properties:
 *                     permissionOperations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["read", "delete", "update"]
 *                       description: List of operations allowed by this permission.
 *             required:
 *               - permissionId
 *               - updateData
 *     responses:
 *       200:
 *         description: Successfully updated the permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Permissions updated successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: The updated permission object.
 *       400:
 *         description: Bad request due to invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid input data.
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "invalid_type"
 *                       expected:
 *                         type: string
 *                         example: "number"
 *                       received:
 *                         type: string
 *                         example: "string"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["permissionId"]
 *                       message:
 *                         type: string
 *                         example: "Expected number, received string"
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       404:
 *         description: Permission not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Permission not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error.
 */

router.put('/update-multiple',  verifyRolePermissions, sanitizeMiddleware, validateMiddleware(updateMultiplePermissionsSchema),PermissionController.updateMultiplePermissions);

// Delete a permission
router.delete('/delete', verifyRolePermissions, PermissionController.deletePermission);

// Assign routes to a permission
router.post('/assign-routes', verifyRolePermissions, PermissionController.assignRoutesToPermission);

export default router;
