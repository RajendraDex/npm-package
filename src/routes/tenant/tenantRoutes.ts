import { Router, RequestHandler } from 'express';
import TenantController from '../../controllers/tenant/tenantController';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { createTenantSchema, updateStatusSchema, updateTenantSchema } from '../../middlewares/sanitizationSchemas/tenantSchema';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';

const router = Router();

// Create a new tenant
/**
 * @swagger
 * /api/tenants/create:
 *   post:
 *     summary: Create Tenant
 *     description: Creates a new tenant with detailed information.
 *     tags:
 *       - Tenants
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: "Company XYZ"
 *               registrationNumber:
 *                 type: string
 *                 example: "XYZ123456"
 *               emailId:
 *                 type: string
 *                 example: "contact@companyxyz.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "9800000000"
 *               username:
 *                 type: string
 *                 example: "userxyz"
 *               password:
 *                 type: string
 *                 example: "Secure@1234"
 *               domainName:
 *                 type: string
 *                 example: "companyxyz"
 *               addressLine1:
 *                 type: string
 *                 example: "123 XYZ St."
 *               addressLine2:
 *                 type: string
 *                 example: "Suite 100"
 *               city:
 *                 type: integer
 *                 example: 123
 *               state:
 *                 type: integer
 *                 example: 45
 *               countryCode:
 *                 type: string
 *                 example: "001"
 *               country:
 *                 type: integer
 *                 example: 90
 *               zipcode:
 *                 type: string
 *                 example: "12345"
 *               contactFirstName:
 *                 type: string
 *                 example: "John"
 *               contactLastName:
 *                 type: string
 *                 example: "Doe"
 *               contactEmailId:
 *                 type: string
 *                 example: "john.doe@companyxyz.com"
 *               contactPhoneNumber:
 *                 type: string
 *                 example: "9800000001"
 *               contactAlternatePhoneNumber:
 *                 type: string
 *                 example: "9800000002"
 *               contactPhoneNumberCountryCode:
 *                 type: string
 *                 example: "001"
 *               contactAlternatePhoneNumberCountryCode:
 *                 type: string
 *                 example: "001"
 *               operationHours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       example: "MON"
 *                     startTime:
 *                       type: string
 *                       format: time
 *                       example: "09:00:00"
 *                     endTime:
 *                       type: string
 *                       format: time
 *                       example: "12:00:00"
 *             required:
 *               - companyName
 *               - registrationNumber
 *               - emailId
 *               - phoneNumber
 *               - username
 *               - password
 *               - domainName
 *               - addressLine1
 *               - city
 *               - state
 *               - countryCode
 *               - country
 *               - zipcode
 *               - contactFirstName
 *               - contactLastName
 *               - contactPhoneNumber
 *     responses:
 *       201:
 *         description: New record has been successfully created.
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
 *                   example: "New record has been successfully created."
 *                 data:
 *                   type: null
 *       400:
 *         description: Invalid input data or missing required fields.
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
 *                       message:
 *                         type: string
 *                         example: "Contact phone number is required"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "contactPhoneNumber"
 *       409:
 *         description: Conflict due to company already existing.
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
 *                   example: "Company already exists."
 *                 data:
 *                   type: null
 */

router.post('/create', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(createTenantSchema) as RequestHandler, TenantController.createTenant as RequestHandler);

// Get a list of tenants
/**
 * @swagger
 * /api/tenants/list:
 *   get:
 *     summary: List Tenants
 *     description: Retrieves a paginated list of tenants with optional sorting.
 *     tags:
 *       - Tenants
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 40
 *         required: true
 *         description: Number of items per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: tenantName
 *         required: true
 *         description: Field by which to sort the results.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           example: asc
 *         required: true
 *         description: Sort order (asc or desc).
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer {{access-token}}"
 *         required: true
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: List of tenants fetched successfully.
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
 *                   example: "Companies fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "daca3028-87e0-4c03-9b1a-5509ee24706a"
 *                           tenantName:
 *                             type: string
 *                             example: "APKA SALON"
 *                           email:
 *                             type: string
 *                             example: "apkasalon@gmail.com"
 *                           phoneNumber:
 *                             type: string
 *                             example: "9669870839"
 *                           tenantStatus:
 *                             type: integer
 *                             example: 1
 *                           contactFirstName:
 *                             type: string
 *                             example: "Sachin"
 *                           contactLastName:
 *                             type: string
 *                             example: "Sachin"
 *                           domain:
 *                             type: string
 *                             example: "apkasalon"
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
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

router.get('/list', verifyRolePermissions as RequestHandler, TenantController.getTenants as unknown as RequestHandler);
router.get('/address', verifyRolePermissions as RequestHandler, TenantController.getAddressses as unknown as RequestHandler)

// Get details of a specific tenant by ID
/**
 * @swagger
 * /api/tenants/{tenantId}:
 *   get:
 *     summary: Get Tenant by ID
 *     description: Retrieves detailed information about a specific tenant.
 *     tags:
 *       - Tenants
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: ID of the tenant to retrieve
 *         schema:
 *           type: string
 *           example: "0bf02594-4db7-492e-899a-40107693cd9e"
 *     responses:
 *       200:
 *         description: Company fetched successfully.
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
 *                   example: "Company fetched successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "0bf02594-4db7-492e-899a-40107693cd9e"
 *                     tenantName:
 *                       type: string
 *                       example: "APKA2.0"
 *                     email:
 *                       type: string
 *                       example: "apka@gmail.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "9630804820"
 *                     tenantStatus:
 *                       type: integer
 *                       example: 1
 *                     contactFirstName:
 *                       type: string
 *                       example: "Manish"
 *                     contactLastName:
 *                       type: string
 *                       example: "Manish"
 *                     alternatePhoneNumber:
 *                       type: string
 *                       example: "9301307821"
 *                     username:
 *                       type: string
 *                       example: null
 *                     profilePic:
 *                       type: string
 *                       example: null
 *                     countryCode:
 *                       type: string
 *                       example: "91"
 *                     registrationNumber:
 *                       type: string
 *                       example: "APK201"
 *                     tenantSubdomain:
 *                       type: string
 *                       example: "asp"
 *                     status:
 *                       type: integer
 *                       example: 1
 *                     address:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           contactFirstName:
 *                             type: string
 *                             example: "Manish"
 *                           contactLastName:
 *                             type: string
 *                             example: "Manish"
 *                           email:
 *                             type: string
 *                             example: "apka@gmail.com"
 *                           contactPhoneNumberCountryCode:
 *                             type: string
 *                             example: "91"
 *                           phoneNumber:
 *                             type: string
 *                             example: "9630804820"
 *                           alternatePhoneNumber:
 *                             type: string
 *                             example: "9301307821"
 *                           alternatePhoneNumberCountryCode:
 *                             type: string
 *                             example: "91"
 *                           addressLine1:
 *                             type: string
 *                             example: "6/15 Indore"
 *                           addressLine2:
 *                             type: string
 *                             example: "Madhya Pradesh"
 *                           city:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 132166
 *                               name:
 *                                 type: string
 *                                 example: "Indore"
 *                           state:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 4039
 *                               name:
 *                                 type: string
 *                                 example: "Madhya Pradesh"
 *                           country:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 101
 *                               name:
 *                                 type: string
 *                                 example: "India"
 *                           zipcode:
 *                             type: string
 *                             example: "452011"
 *                     operationHours:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           dayOfWeek:
 *                             type: string
 *                             example: "MON"
 *                           startTime:
 *                             type: string
 *                             format: time
 *                             example: "09:00:00"
 *                           endTime:
 *                             type: string
 *                             format: time
 *                             example: "12:00:00"
 *       404:
 *         description: Tenant not found.
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
 *                   example: "Tenant with ID {tenantId} not found."
 */

router.get('/:tenantId', verifyRolePermissions as RequestHandler, TenantController.getTenant as unknown as RequestHandler);

// Update the status of a specific tenant
/**
 * @swagger
 * /api/tenants/status/{id}:
 *   patch:
 *     summary: Update Tenant Status
 *     description: Updates the status of a tenant by ID.
 *     tags:
 *       - Tenants
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the tenant whose status is to be updated
 *         schema:
 *           type: string
 *           example: "1cece478-5798-4aa7-bcf0-95087dadb602"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 1
 *                 description: The new status value for the tenant. Must be an integer.
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Tenant status updated successfully.
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
 *                   example: "Tenant status updated successfully."
 *                 data:
 *                   type: null
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
 *                         example: "number"
 *                       received:
 *                         type: string
 *                         example: "string"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "status"
 *                       message:
 *                         type: string
 *                         example: "Expected number, received string"
 *       404:
 *         description: Tenant with the specified ID not found.
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
 *                   example: "Tenant with ID {id} not found."
 *                 data:
 *                   type: null
 */

router.patch('/status/:tenantId', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(updateStatusSchema) as RequestHandler, TenantController.updateTenantStatus as unknown as RequestHandler);

// Update an existing tenant
/**
 * @swagger
 * /api/tenants/{tenantId}:
 *   put:
 *     summary: Update Tenant
 *     description: Updates an existing tenant's information.
 *     tags:
 *       - Tenants
 *     parameters:
 *       - name: tenantId
 *         in: path
 *         required: true
 *         description: ID of the tenant to update
 *         schema:
 *           type: string
 *           example: "845a24b4-f4e9-46bd-bf0e-fa589dc8d5d7"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: "naming"
 *               registrationNumber:
 *                 type: string
 *                 example: "TEsSTAPKA123"
 *               emailId:
 *                 type: string
 *                 example: "testing@gmail.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "9667856564"
 *               username:
 *                 type: string
 *                 example: "tesst"
 *               password:
 *                 type: string
 *                 example: "Default@123"
 *               addressLine1:
 *                 type: string
 *                 example: "6/15 Indore"
 *               addressLine2:
 *                 type: string
 *                 example: "Madhya Pradesh"
 *               city:
 *                 type: integer
 *                 example: 132166
 *               state:
 *                 type: integer
 *                 example: 4039
 *               countryCode:
 *                 type: string
 *                 example: "91"
 *               country:
 *                 type: integer
 *                 example: 101
 *               zipcode:
 *                 type: string
 *                 example: "452011"
 *               contactFirstName:
 *                 type: string
 *                 example: "Sachin"
 *               contactLastName:
 *                 type: string
 *                 example: "Sachin"
 *               contactEmailId:
 *                 type: string
 *                 example: "testsapkasalon@gmail.com"
 *               contactPhoneNumber:
 *                 type: string
 *                 example: "9435452348"
 *               contactAlternatePhoneNumber:
 *                 type: string
 *                 example: ""
 *               contactPhoneNumberCountryCode:
 *                 type: string
 *                 example: "91"
 *               contactAlternatePhoneNumberCountryCode:
 *                 type: string
 *                 example: ""
 *               operationHours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     dayOfWeek:
 *                       type: string
 *                       example: "MON"
 *                     startTime:
 *                       type: string
 *                       format: time
 *                       example: "09:00:00"
 *                     endTime:
 *                       type: string
 *                       format: time
 *                       example: "12:00:00"
 *     responses:
 *       200:
 *         description: Tenant updated successfully.
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
 *                   example: "The record has been updated successfully.."
 *                 data:
 *                   type: null
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
 *       404:
 *         description: Tenant not found.
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
 *                   example: "Tenant with ID {tenantId} not found."
 */

router.put('/:tenantId', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(updateTenantSchema) as RequestHandler, TenantController.updateTenant as unknown as RequestHandler);

export default router;
