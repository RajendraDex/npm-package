import { Router, RequestHandler } from 'express';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import AuthController from '../../controllers/tenant/auth';
import { createCustomerSchema } from '../../middlewares/sanitizationSchemas/customerSchema';
import { captchaMiddleware } from '../../middlewares/core/reCaptchaMiddleware';
const router = Router();

/**
 * @swagger
 * /api/tenants/customer/signup:
 *   post:
 *     summary: Tenant Customer Signup
 *     description: Creates a new customer for a tenant if the username, email, and phone number are unique.
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Manish"
 *               lastName:
 *                 type: string
 *                 example: "Patil"
 *               emailId:
 *                 type: string
 *                 format: email
 *                 example: "manish@gmail.com"
 *               countryCode:
 *                 type: integer
 *                 example: 91
 *               phoneNumber:
 *                 type: string
 *                 example: "1233827891"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               username:
 *                 type: string
 *                 example: "manish"
 *               gender:
 *                 type: string
 *                 enum: [m, f, o]
 *                 example: "m"
 *               profilePic:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/profile-pic.jpg"
 *               additionalInfo:
 *                 type: object
 *                 properties:
 *                   profession:
 *                     type: string
 *                     example: "doctor"
 *             required:
 *               - firstName
 *               - lastName
 *               - emailId
 *               - countryCode
 *               - phoneNumber
 *               - password
 *               - username
 *               - gender
 *     parameters:
 *       - in: header
 *         name: domainname
 *         schema:
 *           type: string
 *         required: true
 *         description: The tenant's domain name
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           format: jwt
 *         required: true
 *         description: Bearer token for authorization
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
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Bad Request
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
 *                 data:
 *                   type: object
 *                   nullable: true
 *             examples:
 *               UserNameTaken:
 *                 summary: Username already taken
 *                 value:
 *                   code: 400
 *                   message: "User Name Already Taken"
 *                   data: null
 *               CustomerExists:
 *                 summary: Customer already exists
 *                 value:
 *                   code: 400
 *                   message: "Customer Already Exists"
 *                   data: null
 *               PhoneNumberExists:
 *                 summary: Phone number already exists
 *                 value:
 *                   code: 400
 *                   message: "Phone number already exist"
 *                   data: null
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
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: object
 *                   nullable: true
 */

router.post('/signup', captchaMiddleware as RequestHandler, sanitizeMiddleware, validateMiddleware(createCustomerSchema) as RequestHandler, AuthController.signup as RequestHandler);

export default router;
