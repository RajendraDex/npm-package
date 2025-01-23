import { Router, RequestHandler } from 'express';
import RoleController from '../../controllers/auth/roleController';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
// import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
import { createRoleSchema, updateRoleSchema } from '../../middlewares/sanitizationSchemas/roleSchema';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
// import { roleSchema } from '../../middlewares/auth/roleSchemaSanitization';

const router = Router();
// Route to create a new role
/**
 * @swagger
 * /api/roles/create:
 *   post:
 *     summary: Create a new role
 *     description: Adds a new role with the specified name, description, and permissions (grants).
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: "SKSADManager"
 *                 description: The name of the role.
 *               roleDescription:
 *                 type: string
 *                 example: "Administrator role with all permissions"
 *                 description: A description of the role.
 *               grants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: The ID of the resource to which permissions apply.
 *                     actions:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "create"
 *                         description: The actions allowed on the resource.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       201:
 *         description: New role added successfully.
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
 *                   example: "New role added successfully."
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid input data.
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
 *                   example: "Invalid input data"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: "too_small"
 *                       minimum:
 *                         type: integer
 *                         example: 1
 *                       type:
 *                         type: string
 *                         example: "string"
 *                       inclusive:
 *                         type: boolean
 *                         example: true
 *                       exact:
 *                         type: boolean
 *                         example: false
 *                       message:
 *                         type: string
 *                         example: "Role name is required"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "roleName"
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
 *                   example: "Unauthorized."
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
 *                   example: "Internal server error."
 */


router.post('/create', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(createRoleSchema) as RequestHandler, RoleController.createRole as unknown as RequestHandler);

// Route to get a list of roles
/**
 * @swagger
 * /api/roles/list:
 *   get:
 *     summary: Retrieve a list of roles
 *     description: Fetches a list of roles along with their role IDs.
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           example: "application/json"
 *         required: true
 *         description: The content type of the request.
 *     responses:
 *       200:
 *         description: Roles fetched successfully.
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
 *                   example: "Roles Fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                         example: "Super Admin"
 *                         description: The name of the role.
 *                       roleId:
 *                         type: integer
 *                         example: 1
 *                         description: The ID of the role.
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
 *                   example: "Unauthorized."
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
 *                   example: "Internal server error."
 */

router.get('/list', verifyRolePermissions as RequestHandler, RoleController.getRoles as unknown as RequestHandler);

// Route to get a specific role by ID
/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Retrieve a specific role by ID
 *     description: Fetches the details of a specific role, including its permissions.
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: The ID of the role to fetch.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: Role fetched successfully.
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
 *                   example: "Role Fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: The ID of the role.
 *                     role:
 *                       type: string
 *                       example: "Super Admin"
 *                       description: The name of the role.
 *                     grants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           resource:
 *                             type: string
 *                             example: "All"
 *                             description: The resource that the role has access to.
 *                           actions:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "create"
 *                             description: The actions allowed on the resource.
 *                           id:
 *                             type: integer
 *                             example: 1
 *                             description: The ID of the grant.
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
 *                   example: "Unauthorized."
 *       404:
 *         description: Role not found.
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
 *                   example: "Role not found."
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
 *                   example: "Internal server error."
 */

router.get('/:id', verifyRolePermissions as RequestHandler, RoleController.getRoleById as unknown as RequestHandler);

// Route to delete a role by ID
/**
 * @swagger
 * /api/roles/{roleId}:
 *   delete:
 *     summary: Delete a role
 *     description: Deletes a role identified by `roleId`.
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: The ID of the role to delete.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: Role deleted successfully.
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
 *                   example: "Role deleted successfully."
 *                 data:
 *                   type: null
 *                   example: null
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
 *                   example: "Unauthorized."
 *       404:
 *         description: Role not found.
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
 *                   example: "Role not found."
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
 *                   example: "Internal server error."
 */

router.delete('/:id', verifyRolePermissions as RequestHandler, RoleController.deleteRoleById as unknown as RequestHandler);

// Route to update an existing role
/**
 * @swagger
 * /api/roles/{roleId}:
 *   put:
 *     summary: Update a role
 *     description: Updates the details of an existing role, including its description and associated permissions.
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 4
 *         description: The ID of the role to update.
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
 *               roleDescription:
 *                 type: string
 *                 example: "Hello"
 *                 description: A description of the role.
 *               actions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     permissionId:
 *                       type: integer
 *                       example: 1
 *                       description: The ID of the permission.
 *                     permissionOperations:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: "read"
 *                         description: The operations allowed for the permission.
 *     responses:
 *       200:
 *         description: Role updated successfully.
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
 *                   example: "Role updated successfully."
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid input data.
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
 *                   example: "Invalid input data"
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
 *                           example: "roleDescription"
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
 *                   example: "Unauthorized."
 *       404:
 *         description: Role not found.
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
 *                   example: "Role not found."
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
 *                   example: "Internal server error."
 */

router.put('/:id', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(updateRoleSchema) as RequestHandler, RoleController.updateRole as unknown as RequestHandler);
export default router;
