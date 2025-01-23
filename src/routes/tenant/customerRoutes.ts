import { Router, RequestHandler } from 'express';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import CustomerController from '../../controllers/tenant/customerController';
import { changeStatusSchema, createCustomerSchema, deleteCustomerOfferLinkSchema, deleteCustomerSchema, updateCustomerSchema } from '../../middlewares/sanitizationSchemas/customerSchema';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
const router = Router();

// Create a new customer
/**
 * @swagger
 * /api/tenants/customer/create:
 *   post:
 *     summary: Create New Customer
 *     description: Adds a new customer to the system.
 *     tags:
 *       - Customers
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Manish"
 *                 description: First name of the customer.
 *               lastName:
 *                 type: string
 *                 example: "Patil"
 *                 description: Last name of the customer.
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: "abc@gmail.com"
 *                 description: Email ID of the customer.
 *               countryCode:
 *                 type: integer
 *                 example: 1
 *                 description: Country code of the customer's phone number.
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *                 description: Phone number of the customer.
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *                 description: Password for the customer account.
 *               gender:
 *                 type: string
 *                 enum: [m, f, other]
 *                 example: "m"
 *                 description: Gender of the customer.
 *               profilePic:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/profile-pic.jpg"
 *                 description: URL of the customer's profile picture.
 *               dob:
 *                 type: string
 *                 example: "31-11"
 *                 description: Date of birth of the customer.
 *               promotionId:
 *                 type: string
 *                 format: uuid
 *                 example: "c7a7f1f3-7867-4450-91c1-2ebade1ff3e4"
 *                 description: Promotion ID associated with the customer.
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-15"
 *                 description: Date of the customer's last purchase.
 *             required:
 *               - firstName
 *               - lastName
 *               - emailId
 *               - countryCode
 *               - phoneNumber
 *               - password
 *               - gender
 *     responses:
 *       201:
 *         description: New customer added successfully.
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
 *                   example: "New customer added successfully."
 *                 data:
 *                   type: null
 *       400:
 *         description: Invalid input data or customer already exists.
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
 *                           example: "countryCode"
 *                       message:
 *                         type: string
 *                         example: "Expected number, received string"
 *                 data:
 *                   type: null
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-request-origin
 *         required: true
 *         schema:
 *           type: string
 *           example: "asp"
 *         description: Origin of the request.
 */

router.post('/create', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(createCustomerSchema) as RequestHandler, CustomerController.createCustomer as unknown as RequestHandler);
/**
 * @swagger
 * /api/tenants/customer/list:
 *   get:
 *     summary: List Customers
 *     description: Fetch a list of customers with pagination, sorting, and search options.
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Number of items per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "email"
 *         description: Field to sort the results by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "desc"
 *         description: Sort order for the results.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: "9630804820"
 *         description: Search term to filter the results.
 *     responses:
 *       200:
 *         description: Customers fetched successfully.
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
 *                   example: "Customers fetched Successfully"
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
 *                             format: uuid
 *                             example: "dc2f43da-1249-4416-b31f-420c5aa620bb"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "johndoe@example.com"
 *                           countryCode:
 *                             type: integer
 *                             example: 1
 *                           phoneNumber:
 *                             type: string
 *                             example: "1234567890"
 *                           customerStatus:
 *                             type: integer
 *                             example: 1
 *                           isDeleted:
 *                             type: integer
 *                             example: 0
 *                           dob:
 *                             type: string
 *                             example: "31-11"
 *                             description: Date of birth of the customer.
 *                           promotionId:
 *                             type: string
 *                             format: uuid
 *                             example: "c7a7f1f3-7867-4450-91c1-2ebade1ff3e4"
 *                             description: Promotion ID associated with the customer.
 *                           promotionName:
 *                             type: string
 *                             example: "Winter sale"
 *                             description: Name of the promotion.
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *                     currentPage:
 *                       type: integer
 *                       example: 2
 *                     totalRecords:
 *                       type: integer
 *                       example: 10
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 */
router.get('/list', verifyRolePermissions as RequestHandler, CustomerController.getCustomers as unknown as RequestHandler);
/**
 * @swagger
 * /api/tenants/customer/{customerId}:
 *   put:
 *     summary: Update Customer Details
 *     description: Updates the details of a specific customer identified by `customerId`.
 *     tags:
 *       - Customers
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "dc2f43da-1249-4416-b31f-420c5aa620bb"
 *           description: Unique identifier of the customer to be updated.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *                 description: First name of the customer.
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *                 description: Last name of the customer.
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *                 description: Email address of the customer.
 *               countryCode:
 *                 type: integer
 *                 example: 91
 *                 description: Country code for the customer's phone number.
 *               phoneNumber:
 *                 type: string
 *                 example: "1234567890"
 *                 description: Phone number of the customer.
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *                 description: Password for the customer account.
 *               gender:
 *                 type: string
 *                 enum: [m, f, o]
 *                 example: "m"
 *                 description: Gender of the customer. (m = male, f = female, o = other)
 *               profilePic:
 *                 type: string
 *                 format: uri
 *                 example: "http://example.com/profile.jpg"
 *                 description: URL to the customer's profile picture.
 *               dob:
 *                 type: string
 *                 example: "31-11"
 *                 description: Date of birth of the customer.
 *               promotionId:
 *                 type: string
 *                 format: uuid
 *                 example: "0506b0dd-9ba8-4013-a626-fa54f251ca02"
 *                 description: Promotion ID associated with the customer.
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-14T18:30:00.000Z"
 *                 description: Date of the customer's last purchase.
 *     responses:
 *       200:
 *         description: Customer details updated successfully.
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
 *                   example: "Customer details updated successfully."
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
 *                         example: ["countryCode"]
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 */

router.put('/:id', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(updateCustomerSchema) as RequestHandler, CustomerController.updateCustomer as unknown as RequestHandler);

/**
 * @swagger
 * /api/tenants/customer:
 *   patch:
 *     summary: Update Customer Status
 *     description: Updates the status of a customer based on their `customerId`.
 *     tags:
 *       - Customers
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 example: "dc2f43da-1249-4416-b31f-420c5aa620bb"
 *                 description: Unique identifier of the customer.
 *               status:
 *                 type: integer
 *                 enum: [0, 1, 2]
 *                 example: 1
 *                 description: Status to be updated. Valid values are 0 (Inactive), 1 (Active), and 2 (Suspended).
 *             required:
 *               - customerId
 *               - status
 *     responses:
 *       200:
 *         description: Customer status changed successfully.
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
 *                   example: "Customer status changed successfully."
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
 *                         example: "invalid_union"
 *                       unionErrors:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             issues:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   received:
 *                                     type: integer
 *                                   code:
 *                                     type: string
 *                                   expected:
 *                                     type: integer
 *                                   path:
 *                                     type: array
 *                                     items:
 *                                       type: string
 *                                   message:
 *                                     type: string
 *                           required:
 *                             - issues
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["status"]
 *                       message:
 *                         type: string
 *                         example: "Invalid input"
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 */

router.patch('', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(changeStatusSchema) as RequestHandler, CustomerController.updateCustomerFields as unknown as RequestHandler)
/**
 * @swagger
 * /api/tenants/customer:
 *   delete:
 *     summary: Delete or Recover Customer
 *     description: Soft-delete or recover a customer based on the `isDeleted` flag.
 *     tags:
 *       - Customers
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 example: "dc2f43da-1249-4416-b31f-420c5aa620bb"
 *                 description: Unique identifier of the customer.
 *               isDeleted:
 *                 type: integer
 *                 example: 0
 *                 description: Flag indicating if the customer should be soft-deleted (1) or recovered (0).
 *             required:
 *               - customerId
 *               - isDeleted
 *     responses:
 *       200:
 *         description: Customer deleted or recovered successfully.
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
 *                   example: "Customer deleted successfully."  # or "Customer recovered successfully."
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
 *                         example: "integer"
 *                       received:
 *                         type: string
 *                         example: "string"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["isDeleted"]
 *                       message:
 *                         type: string
 *                         example: "Expected integer, received string"
 *       404:
 *         description: Customer not found.
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
 *                   example: "Customer not found."
 *                 data:
 *                   type: null
 */

router.delete('', verifyRolePermissions as RequestHandler, sanitizeMiddleware, validateMiddleware(deleteCustomerSchema) as RequestHandler, CustomerController.updateCustomerFields as unknown as RequestHandler)

/**
 * @swagger
 * /api/tenants/customer/{customerId}:
 *   get:
 *     summary: Get Customer Details
 *     description: Retrieves the details of a specific customer identified by `customerId`.
 *     tags:
 *       - Customers
 *     parameters:
 *       - name: customerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "d5a2639a-bfa8-41bb-9578-4120d968c156"
 *           description: Unique identifier of the customer to retrieve.
 *       - name: domainname
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *           description: Domain name of the tenant making the request.
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           format: bearer
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUyMzAzZjRhLWZjY2ItNGY5MS04NGQ2LWZkMjZjNjQwNTFlNyIsImlhdCI6MTcyNTI3NTQyNCwiZXhwIjoxNzI1Mjc5MDI0fQ.5mziQezjqaDaVNax3kKRP6KUhMdtEmx6rbBFohf9t4k"
 *           description: JWT token for authorization.
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully.
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
 *                   example: "Customer details retrieved successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     customerId:
 *                       type: string
 *                       format: uuid
 *                       example: "dc2f43da-1249-4416-b31f-420c5aa620bb"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     emailId:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     countryCode:
 *                       type: integer
 *                       example: 91
 *                     gender:
 *                       type: string
 *                       enum: [m, f, o]
 *                       example: "m"
 *                     profilePic:
 *                       type: string
 *                       format: uri
 *                       example: "http://example.com/profile.jpg"
 *                     dob:
 *                       type: string
 *                       example: "31-11"
 *                     offerDetails:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: "0506b0dd-9ba8-4013-a626-fa54f251ca02"
 *                         promotionName:
 *                           type: string
 *                           example: "Winter sale"
 *                         payPrice:
 *                           type: string
 *                           example: "₹1200.00"
 *                         getPrice:
 *                           type: string
 *                           example: "₹1300.00"
 *                         offerDuration:
 *                           type: integer
 *                           example: 2
 *                         expiryDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-14T18:30:00.000Z"
 *                         purchaseDate:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-04-13T18:30:00.000Z"
 *       404:
 *         description: Customer not found.
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
 *                   example: "Customer not found"
 *                 data:
 *                   type: null
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 */

router.get('/:id', verifyRolePermissions as RequestHandler, CustomerController.fetchCustomer as unknown as RequestHandler)
/**
 * @swagger
 * /api/tenants/customer/file/export-csv:
 *   get:
 *     summary: Export Customers to CSV
 *     description: Exports the list of customers to a CSV file.
 *     tags:
 *       - Customers
 *     parameters:
 *       - name: x-request-origin
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *           description: Origin of the request.
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           format: bearer
 *           example: "Bearer <token>"
 *           description: JWT token for authorization.
 *     responses:
 *       200:
 *         description: Customers exported successfully.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               example: "id,First Name,Last Name,Email,Country Code,Phone Number,Status\n89434420-b766-4c93-aeab-cfdcb7d1452b,pateljyoti,patel,jyoti@yopmail.com,91,919876543211,0"
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 */
router.get('/file/export-csv', verifyRolePermissions as RequestHandler, CustomerController.exportCustomersToCSV as unknown as RequestHandler);

/**
 * @swagger
 * /api/tenants/customer/delete-offer-link:
 *   delete:
 *     summary: Delete Customer Offer Link
 *     description: Deletes a specific offer link associated with a customer.
 *     tags:
 *       - Customers
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promotionId:
 *                 type: string
 *                 format: uuid
 *                 example: "bbb6f030-2c2e-45b2-b31d-b6fb7d8cc0e7"
 *                 description: Unique identifier of the promotion.
 *               customerId:
 *                 type: string
 *                 format: uuid
 *                 example: "f8a39f33-894d-4212-be39-6c053474a097"
 *                 description: Unique identifier of the customer.
 *     responses:
 *       200:
 *         description: Delete successful.
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
 *                   example: "Delete Successful"
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
 *                         example: "uuid"
 *                       received:
 *                         type: string
 *                         example: "string"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: ["promotionId"]
 *                       message:
 *                         type: string
 *                         example: "Expected uuid, received string"
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: null
 *       404:
 *         description: Customer or promotion not found.
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
 *                   example: "Customer or promotion not found"
 *                 data:
 *                   type: null
 *     security:
 *       - bearerAuth: []
 */
router.delete('/delete-offer-link', sanitizeMiddleware, verifyRolePermissions as RequestHandler, validateMiddleware(deleteCustomerOfferLinkSchema) as RequestHandler, CustomerController.deleteCustomerOfferLink as unknown as RequestHandler);

export default router;
