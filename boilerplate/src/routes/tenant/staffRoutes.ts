import { Router } from 'express';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
import StaffController from '../../controllers/tenant/staffController'
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { staffSchema, updateStaffSchema, staffIdSchema, staffStatusSchema, staffDeleteSchema } from '../../middlewares/sanitizationSchemas/staffSchema'; // Import staffIdSchema
const router = Router();

/**
 * @swagger
 * /api/tenants/staff/create:
 *   post:
 *     summary: Create a new staff member
 *     description: Adds a new staff member to the system.
 *     tags:
 *       - Staff
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Kyle"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               emailId:
 *                 type: string
 *                 example: "testinsg.doe@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "1110867890"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *               staffBrief:
 *                 type: string
 *                 example: "Brief description about the staff."
 *               countryCode:
 *                 type: string
 *                 example: "91"
 *               dateOfJoining:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               mobileNumber:
 *                 type: string
 *                 example: "9011904822"
 *               gender:
 *                 type: string
 *                 enum: [m, f]
 *                 example: "m"
 *               addressLine1:
 *                 type: string
 *                 example: "123 Main St"
 *               addressLine2:
 *                 type: string
 *                 example: "Apt 4B"
 *               city:
 *                 type: integer
 *                 example: 1
 *               state:
 *                 type: integer
 *                 example: 1
 *               country:
 *                 type: integer
 *                 example: 1
 *               pincode:
 *                 type: string
 *                 example: "123456"
 *               profilePic:
 *                 type: string
 *                 example: "http://example.com/profile.jpg"
 *               staffExperience:
 *                 type: integer
 *                 example: 43
 *               staffType:
 *                 type: string
 *                 example: "staff"
 *               staffBio:
 *                 type: string
 *                 example: "staff bio "
 *               tenantAddressId:
 *                 type: integer
 *                 example: 1
 *               createdBy:
 *                 type: string
 *                 example: "dd44226e-d4d3-4894-b6a9-2930e3a9571d"
 *               providerSpecializations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["07748d6b-d81e-4cfb-8807-48159b700ebc"]
 *               Roles:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               commissionPercentage:
 *                 type: number
 *                 format: float
 *                 example: 20.10
 *               dateOfExit:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-13"
 *             required:
 *               - firstName
 *               - lastName
 *               - emailId
 *               - phoneNumber
 *               - password
 *               - dateOfJoining
 *               - gender
 *     responses:
 *       200:
 *         description: Staff created successfully
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
 *                   example: "Staff created successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Staff already exists
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
 *                   example: "Staff already exists"
 *                 data:
 *                   type: null
 */
router.post('/create', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(staffSchema), StaffController.createStaff);

/**
 * @swagger
 * /api/tenants/staff/list:
 *   get:
 *     summary: List staff members
 *     description: Retrieves a list of staff members with pagination and optional sorting and filtering.
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number of the staff list
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of staff members per page
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         required: false
 *         description: Field to sort the staff list
 *         schema:
 *           type: string
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         description: Order of sorting (asc or desc)
 *         schema:
 *           type: string
 *       - name: type
 *         in: query
 *         required: false
 *         description: Filter by staff type
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         required: false
 *         description: Search term
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetch successful
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
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "c27fcff2-2692-470c-88ff-b15c75f0d7b5"
 *                           name:
 *                             type: string
 *                             example: "Atharv Sams"
 *                           profilePic:
 *                             type: string
 *                             example: null
 *                           status:
 *                             type: integer
 *                             example: 1
 *                           isDeleted:
 *                             type: integer
 *                             example: 0
 *                           bio:
 *                             type: string
 *                             example: null
 *                           mobileNumber:
 *                             type: string
 *                             example: "9845639458"
 *                           countryCode:
 *                             type: string
 *                             example: "91"
 *                           commissionPercentage:
 *                             type: number
 *                             format: float
 *                             example: 0
 *                           specialty:
 *                             type: array
 *                             items:
 *                               type: string
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalRecords:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid parameters
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
 *                   example: "Invalid parameters"
 *                 data:
 *                   type: null
 */
router.get('/list', verifyRolePermissions, StaffController.getStaffList); // Route to get staff list

/**
 * @swagger
 * /api/tenants/staff/{id}:
 *   get:
 *     summary: Fetch a staff member by ID
 *     description: Retrieves the details of a specific staff member from the system.
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the staff member to fetch
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetch successful
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
 *                     id:
 *                       type: string
 *                       example: "c21c7e2a-7df8-4e18-9b8f-405d25984c05"
 *                     firstName:
 *                       type: string
 *                       example: "Kyle"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     emailId:
 *                       type: string
 *                       example: "testinsg.doe@example.com"
 *                     mobileNumber:
 *                       type: string
 *                       example: "9011904822"
 *                     countryCode:
 *                       type: string
 *                       example: "91"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1110867890"
 *                     tenantAddressId:
 *                       type: integer
 *                       example: 1
 *                     staffBrief:
 *                       type: string
 *                       example: "Brief description about the staff."
 *                     dateOfJoining:
 *                       type: string
 *                       format: date-time
 *                       example: "2022-12-31T18:30:00.000Z"
 *                     staffGender:
 *                       type: string
 *                       enum: [m, f]
 *                       example: "m"
 *                     addressLine1:
 *                       type: string
 *                       example: "123 Main St"
 *                     addressLine2:
 *                       type: string
 *                       example: "Apt 4B"
 *                     pincode:
 *                       type: string
 *                       example: "123456"
 *                     profilePic:
 *                       type: string
 *                       example: "http://example.com/profile.jpg"
 *                     staffType:
 *                       type: string
 *                       example: "staff"
 *                     staffStatus:
 *                       type: integer
 *                       example: 1
 *                     isDeleted:
 *                       type: integer
 *                       example: 0
 *                     staffBio:
 *                       type: string
 *                       example: "staff bio here"
 *                     createdBy:
 *                       type: string
 *                       example: "1"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           roleId:
 *                             type: integer
 *                             example: 1
 *                           roleName:
 *                             type: string
 *                             example: "Admin"
 *                     experience:
 *                       type: string
 *                       example: "3 years 7 months"
 *                     commissionPercentage:
 *                       type: number
 *                       format: float
 *                       example: 20.12
 *                     dateOfExit:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-13"
 *                     providerSpecializations:
 *                       type: object
 *                       properties:
 *                         specializationServices:
 *                           type: array
 *                           items:
 *                             type: integer
 *                           example: []
 *                     city:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Andorra la Vella"
 *                     state:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Southern Nations, Nationalities, and Peoples' Region"
 *                     country:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Afghanistan"
 *       404:
 *         description: Staff not found
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
 *                   example: "Staff Not Found"
 *                 data:
 *                   type: null
 */
router.get('/:id', verifyRolePermissions, StaffController.fetchStaff); // Validate ID

/**
 * @swagger
 * /api/tenants/staff/{id}:
 *   put:
 *     summary: Update an existing staff member
 *     description: Updates the details of an existing staff member in the system.
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the staff member to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "john"
 *               lastName:
 *                 type: string
 *                 example: "doe"
 *               emailId:
 *                 type: string
 *                 example: "john@gmail.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "9999999999"
 *               staffBrief:
 *                 type: string
 *                 example: null
 *               dateOfJoining:
 *                 type: string
 *                 format: date
 *                 example: "2024-10-15"
 *               gender:
 *                 type: string
 *                 enum: [m, f]
 *                 example: "m"
 *               addressLine1:
 *                 type: string
 *                 example: "indore"
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
 *               pincode:
 *                 type: string
 *                 example: "452010"
 *               tenantAddressId:
 *                 type: integer
 *                 example: 1
 *               staffExperience:
 *                 type: integer
 *                 example: 53
 *               dateOfExit:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-13"
 *               staffType:
 *                 type: string
 *                 example: "provider"
 *               staffStatus:
 *                 type: integer
 *                 example: 1
 *               Roles:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               providerSpecializations:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["814be815-ee9d-464b-8198-9da76669381a"]
 *               commissionPercentage:
 *                 type: number
 *                 format: float
 *                 example: 20.01
 *             required:
 *               - firstName
 *               - lastName
 *               - emailId
 *               - phoneNumber
 *               - dateOfJoining
 *               - gender
 *     responses:
 *       200:
 *         description: Staff member updated successfully
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
 *                   example: "Staff member updated successfully"
 *                 data:
 *                   type: object   
 *       400:
 *         description: Invalid input data or staff member not found
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
 *                 data:
 *                   type: null
 */
router.put('/:id', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(updateStaffSchema), StaffController.updateStaff);

/**
 * @swagger
 * /api/tenants/staff/{id}:
 *   delete:
 *     summary: Delete a staff member
 *     description: Removes a specific staff member from the system.
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the staff member to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDeleted:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Delete successful
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
 *       204:
 *         description: Staff not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 204
 *                 message:
 *                   type: string
 *                   example: "Staff Not Found"
 *                 data:
 *                   type: null
 */
router.delete('/:id', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(staffDeleteSchema), StaffController.updateOrDeleteStaff); // Validate ID

/**
 * @swagger
 * /api/tenants/staff/{id}:
 *   patch:
 *     summary: Update the status of a staff member
 *     description: Updates the status of a specific staff member in the system.
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the staff member to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: "Status updated successfully"
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input data or staff member not found
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
 *                 data:
 *                   type: null
 */
router.patch('/:id', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(staffStatusSchema), StaffController.updateOrDeleteStaff); // Validate ID

export default router;
