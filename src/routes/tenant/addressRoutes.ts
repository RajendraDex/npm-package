import { Router, RequestHandler } from 'express';
import AddressController from '../../controllers/tenant/addressController';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { addressSchema, changeStatusSchema, updateAddressSchema } from '../../middlewares/sanitizationSchemas/addressSchema';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';

const router = Router();

/**
 * @swagger
 * /api/address/create:
 *   post:
 *     summary: Create Address
 *     description: Creates a new address record with detailed information.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: "asp"
 *               addressLine1:
 *                 type: string
 *                 example: "6/15 indore"
 *               addressLine2:
 *                 type: string
 *                 example: "madhya pradesh"
 *               city:
 *                 type: integer
 *                 example: 132166
 *               state:
 *                 type: integer
 *                 example: 4039
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
 *               locationPhoneNumber:
 *                 type: string
 *                 example: "9630804820"
 *               locationCountryCode:
 *                 type: string
 *                 example: "91"
 *     responses:
 *       201:
 *         description: New address record has been successfully created.
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
 *                   example: "New address record has been successfully created."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "daca3028-87e0-4c03-9b1a-5509ee24706a"
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
router.post('/create', sanitizeMiddleware, validateMiddleware(addressSchema) as RequestHandler, verifyRolePermissions as RequestHandler, AddressController.addAddress as unknown as RequestHandler);

/**
 * @swagger
 * /api/address/{addressId}:
 *   put:
 *     summary: Update Address
 *     description: Updates an existing address record by ID.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: ID of the address to update
 *         schema:
 *           type: string
 *           example: "11"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: "asp"
 *               addressLine1:
 *                 type: string
 *                 example: "6/15 indore"
 *               addressLine2:
 *                 type: string
 *                 example: "madhya pradesh"
 *               city:
 *                 type: integer
 *                 example: 132166
 *               state:
 *                 type: integer
 *                 example: 4039
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
 *               locationPhoneNumber:
 *                 type: string
 *                 example: "9630804820"
 *               locationCountryCode:
 *                 type: string
 *                 example: "91"
 *     responses:
 *       200:
 *         description: Record Updated successfully.
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
 *                   example: "Record Updated successfully."
 *                 data:
 *                   type: null
 *       404:
 *         description: Address not found.
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
 *                   example: "Address not found."
 *                 data:
 *                   type: null
 *       400:
 *         description: Address ID is required.
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
 *                   example: "Address ID is required."
 *                 data:
 *                   type: null
 */
router.put('/:addressId', sanitizeMiddleware, validateMiddleware(updateAddressSchema) as RequestHandler, verifyRolePermissions as RequestHandler, AddressController.updateAddress as unknown as RequestHandler);
/**
 * @swagger
 * /api/address/list:
 *   get:
 *     summary: Get Address List
 *     description: Retrieves a paginated list of address records with optional filtering and sorting.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 10
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (asc or desc)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *           example: contactPersonName
 *       - name: status
 *         in: query
 *         description: Filter by status
 *         schema:
 *           type: string
 *           example: Active
 *       - name: search
 *         in: query
 *         description: Search term for filtering results
 *         schema:
 *           type: string
 *           example: madhya
 *     responses:
 *       200:
 *         description: Successfully retrieved address list
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
 *                   example: "Fetch Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     addresses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           locationName:
 *                             type: string
 *                             example: "6/15 indore madhya pradesh"
 *                           contactPersonName:
 *                             type: string
 *                             example: "Manish Manish"
 *                           countryCode:
 *                             type: string
 *                             example: "91"
 *                           phoneNumber:
 *                             type: string
 *                             example: "9630804820"
 *                           status:
 *                             type: string
 *                             example: "Active"
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalRecords:
 *                       type: integer
 *                       example: 4
 *       401:
 *         description: Unauthorized access
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
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
router.get('/list', sanitizeMiddleware, verifyRolePermissions as RequestHandler, AddressController.addressList as unknown as RequestHandler);


/**
 * @swagger
 * /api/address/{addressId}:
 *   get:
 *     summary: Get Address by ID
 *     description: Retrieves detailed information of an address by its ID.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: ID of the address to retrieve
 *         schema:
 *           type: string
 *           example: "11"
 *     responses:
 *       200:
 *         description: Fetch Successful
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
 *                   example: "Fetch Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 11
 *                         contactFirstName:
 *                           type: string
 *                           example: "Sachin"
 *                         contactLastName:
 *                           type: string
 *                           example: "Sachin"
 *                         contactEmailId:
 *                           type: string
 *                           example: "testsapkasalon@gmail.com"
 *                         contactPhoneNumberCountryCode:
 *                           type: string
 *                           example: "91"
 *                         contactPhoneNumber:
 *                           type: string
 *                           example: "9435452348"
 *                         contactAlternatePhoneNumber:
 *                           type: string
 *                           example: ""
 *                         contactAlternatePhoneNumberCountryCode:
 *                           type: string
 *                           example: null
 *                         locationPhoneNumber:
 *                           type: string
 *                           example: "9630804820"
 *                         locationCountryCode:
 *                           type: string
 *                           example: "91"
 *                         addressLine1:
 *                           type: string
 *                           example: "6/15 indore"
 *                         addressLine2:
 *                           type: string
 *                           example: "madhya pradesh"
 *                         city:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 132166
 *                             name:
 *                               type: string
 *                               example: "Indore"
 *                         state:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 4039
 *                             name:
 *                               type: string
 *                               example: "Madhya Pradesh"
 *                         country:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 101
 *                             name:
 *                               type: string
 *                               example: "India"
 *                         zipcode:
 *                           type: string
 *                           example: "452011"
 *                     operationHours:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
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
 *         description: Address not found.
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
 *                   example: "Address not found."
 *                 data:
 *                   type: null
 *       400:
 *         description: Address ID is required.
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
 *                   example: "Address ID is required."
 *                 data:
 *                   type: null
 */
router.get('/:addressId', sanitizeMiddleware, verifyRolePermissions as RequestHandler, AddressController.getAddress as unknown as RequestHandler);

/**
 * @swagger
 * /api/address/{addressId}:
 *   patch:
 *     summary: Update Address Status
 *     description: Updates the status of an existing address record by ID.
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: addressId
 *         in: path
 *         required: true
 *         description: ID of the address to update the status
 *         schema:
 *           type: string
 *           example: "11"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: "asp"
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Record Updated successfully.
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
 *                   example: "Record Updated successfully."
 *                 data:
 *                   type: null
 *       404:
 *         description: Address not found.
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
 *                   example: "Address not found."
 *                 data:
 *                   type: null
 *       400:
 *         description: Address ID is required.
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
 *                   example: "Address ID is required."
 *                 data:
 *                   type: null
 */
router.patch('/:addressId', sanitizeMiddleware, validateMiddleware(changeStatusSchema) as RequestHandler, verifyRolePermissions as RequestHandler, AddressController.changeStatus as unknown as RequestHandler);


export default router;