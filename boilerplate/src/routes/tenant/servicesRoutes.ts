import { Router } from 'express';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { verifyRolePermissions } from '../../middlewares/core/verifyPermisssions';
import serviceController from '../../controllers/tenant/servicesController';
import { createServiceSchema, updateServiceSchema, serviceStatusSchema, serviceDeleteSchema } from '../../middlewares/sanitizationSchemas/servicesSchema';

const router = Router();

/**
 * @swagger
 * /api/services/create:
 *   post:
 *     summary: Create a new service
 *     description: Creates a new service with the provided JSON data.
 *     tags:
 *       - Services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *                 example: "Service1"
 *               serviceDescription:
 *                 type: string
 *                 example: "This is an example service description."
 *               servicePrice:
 *                 type: number
 *                 example: 99.99
 *               serviceCategoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               serviceImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["http://example.com/image.jpg"]
 *               serviceDuration:
 *                 type: integer
 *                 example: 130
 *             required:
 *               - serviceName
 *               - serviceDescription
 *               - servicePrice
 *               - serviceCategoryIds
 *               - serviceImage
 *               - serviceDuration
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4ZDA5NjUxLWQ2ODQtNDA2MC04Y2Y2LWQ3YTQxNTNhMzI4MiIsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsIngtcmVxdWVzdC1vcmlnaW4tdHlwZSI6MSwiaWF0IjoxNzI3MzUwNjU3LCJleHAiOjE3MzAxMjA2NTd9.kJGrV5p7m4XpjgS532bxckaPDTql-Jzj5j4Aw9tYBOA"
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                   example: "New service added successfully."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Service Already Exists
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
 *                   example: "Service Already Exists"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.post('/create', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(createServiceSchema), serviceController.createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update an existing service
 *     description: Updates an existing service with the provided JSON data.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4ZDA5NjUxLWQ2ODQtNDA2MC04Y2Y2LWQ3YTQxNTNhMzI4MiIsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsIngtcmVxdWVzdC1vcmlnaW4tdHlwZSI6MSwiaWF0IjoxNzI3MzUwNjU3LCJleHAiOjE3MzAxMjA2NTd9.kJGrV5p7m4XpjgS532bxckaPDTql-Jzj5j4Aw9tYBOA"
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceName:
 *                 type: string
 *                 example: "Updated Example Service"
 *               serviceDescription:
 *                 type: string
 *                 example: "This is an example service description."
 *               servicePrice:
 *                 type: number
 *                 example: 99.99
 *               serviceCategoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               serviceImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["http://example.com/image.jpg"]
 *               serviceDuration:
 *                 type: integer
 *                 example: 130
 *             required:
 *               - serviceName
 *               - serviceDescription
 *               - servicePrice
 *               - serviceCategoryIds
 *               - serviceImage
 *               - serviceDuration
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   example: "Service updated successfully."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Service Not Found
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
 *                   example: "Service Not Found"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.put('/:id', verifyRolePermissions, sanitizeMiddleware, validateMiddleware(updateServiceSchema), serviceController.updateService);

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     description: Retrieves a list of all services with pagination, sorting, and filtering options.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 2
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of items per page.
 *       - in: query
 *         name: sortField
 *         required: false
 *         schema:
 *           type: string
 *           example: "name"
 *         description: The field to sort the results by.
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           example: "asc"
 *         description: The order to sort the results (asc or desc).
 *       - in: query
 *         name: isDeleted
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Filter for deleted services (0 for not deleted, 1 for deleted).
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Filter for service status.
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     responses:
 *       200:
 *         description: A list of services
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
 *                   example: "FetchSuccessful"
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
 *                             example: "92a82585-b586-41a0-85af-c0f30714c309"
 *                           serviceName:
 *                             type: string
 *                             example: "test new"
 *                           serviceDescription:
 *                             type: string
 *                             example: "asdfghwertyu"
 *                           servicePrice:
 *                             type: string
 *                             example: "99.00"
 *                           serviceImage:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["https://example.com/image1.png"]
 *                           serviceStatus:
 *                             type: integer
 *                             example: 1
 *                           createdBy:
 *                             type: integer
 *                             example: 1
 *                           isDeleted:
 *                             type: integer
 *                             example: 0
 *                           categories:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "bb74a40a-68b5-4db8-b805-9e85af984dd4"
 *                                 name:
 *                                   type: string
 *                                   example: "testing"
 *                     totalPages:
 *                       type: integer
 *                       example: 2
 *                     currentPage:
 *                       type: integer
 *                       example: 2
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.get('/', verifyRolePermissions, sanitizeMiddleware, serviceController.getServices);

/**
 * @swagger
 * /api/services/{id}:
 *   patch:
 *     summary: Change the status of a service
 *     description: Updates the status of an existing service.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ4ZDA5NjUxLWQ2ODQtNDA2MC04Y2Y2LWQ3YTQxNTNhMzI4MiIsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsIngtcmVxdWVzdC1vcmlnaW4tdHlwZSI6MSwiaWF0IjoxNzI3MzUwNjU3LCJleHAiOjE3MzAxMjA2NTd9.kJGrV5p7m4XpjgS532bxckaPDTql-Jzj5j4Aw9tYBOA"
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     requestBody:
 *       required: true
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
 *         description: Service status updated successfully
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
 *                   example: "Service status updated successfully."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Service Not Found
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
 *                   example: "Service Not Found"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.patch('/:id', verifyRolePermissions, sanitizeMiddleware, serviceController.changeServiceStatus);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     description: Retrieves a service by its unique identifier.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     responses:
 *       200:
 *         description: Service retrieved successfully
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
 *                   example: "FetchSuccessful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     serviceName:
 *                       type: string
 *                       example: "serviceName"
 *                     serviceDescription:
 *                       type: string
 *                       example: "service description"
 *                     servicePrice:
 *                       type: string
 *                       example: "400.00"
 *                     serviceImage:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["https://example.com/image.png"]
 *                     serviceStatus:
 *                       type: integer
 *                       example: 1
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     serviceDuration:
 *                       type: integer
 *                       example: 15
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "category-id"
 *                           name:
 *                             type: string
 *                             example: "category name"
 *       404:
 *         description: Service Not Found
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
 *                   example: "Service Not Found"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.get('/:id', verifyRolePermissions, sanitizeMiddleware, serviceController.getServiceById);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service by ID
 *     description: Deletes a service by its unique identifier.
 *     tags:
 *       - Services
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The service ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         required: true
 *         description: Bearer token for authentication
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *           example: "apkasalon"
 *         required: true
 *         description: Custom header for request origin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isDeleted:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Service deleted successfully
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
 *                   example: "Service deleted successfully."
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Service Not Found
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
 *                   example: "Service Not Found"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal Server Error
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 */
router.delete('/:id', verifyRolePermissions, sanitizeMiddleware,validateMiddleware(serviceDeleteSchema), serviceController.deleteService);

export default router;