import { Router } from 'express';
import UserController from '../../controllers/auth/userController';
import { sanitizeMiddleware, validateMiddleware } from '../../middlewares/dataSanitization/sanitizeMiddleware';
import { changePasswordSchema, loginSchema, refreshTokenSchema } from '../../middlewares/sanitizationSchemas/userSchema';
import { validateToken } from '../../middlewares/core/tokenValidator';

const router = Router();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Admin Login
 *     description: Creates a new example resource with the provided JSON data.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@email.com"
 *               password:
 *                 type: string
 *                 example: "Password"
 *             required:
 *               - email
 *               - password
 *     parameters:
 *       - in: header
 *         name: x-custom-header
 *         schema:
 *           type: string
 *         required: false
 *         description: A custom header for the request
*     responses:
 *       200:
 *         description: Successful login
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
 *                   example: "Welcome back! You're logged in."
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "Super"
 *                     lastName:
 *                       type: string
 *                       example: "Admin"
 *                     emailId:
 *                       type: string
 *                       example: "superadmin@example.com"
 *                     profilePic:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     tokens:
 *                       type: object
 *                       properties:
 *                         accessToken:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ*********************************"
 *                         accessTokenExpiry:
 *                           type: string
 *                           example: "3600"
 *                         refreshToken:
 *                           type: string
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ******************************************"
 *                         refreshTokenExpiry:
 *                           type: string
 *                           example: "25600"
 *                     userType:
 *                       type: string
 *                       example: "USER"
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
 *                             example: "USER"
 *                           grants:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 resource:
 *                                   type: string
 *                                   example: "All"
 *                                 actions:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                     example: ["create", "read", "update", "delete"]
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/login', sanitizeMiddleware, validateMiddleware(loginSchema), UserController.login);
/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     description: Refreshes the access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxOGMzZGM1LWYTYtNDFiMS1iNDAzLTM1MDczMTliM2EwMSIsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsIngtcmVxdWVzdC1vcmlnaW4tdHlwZSI6MSwiaWF0IjoxNzI2NDgwNTc0LCJleHAiOjE3MjY1MDc1NzR9.Q4OWdm_2pd4ONAodoS1pWFm5Xn775aoiS6wvircMxxs"
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Successful refresh token
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
 *                   example: "Refresh Token Successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxOGMzZGM1LWIxYTYtNDFiMS1iNDAzLTM1MDczMTliM2EwMSIsImVtYWlsIjoic3VwZXJhZG1pbkBleGFtcGxlLmNvbSIsIngtcmVxdWVzdC1vcmlnaW4tdHlwZSI6MSwiaWF0IjoxNzI2NDgzODM4LCJleHAiOjE3MjY4NDM4Mzh9.-B_Nhyu71lAilG3aS9a7DPxStN-oK9eJZIi51fXJx1A"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Invalid Refresh Token
 *       500:
 *         description: Internal Server Error
 */
router.post('/refresh-token', sanitizeMiddleware, validateMiddleware(refreshTokenSchema), UserController.refreshAccessToken)
/**
 * @swagger
 * /api/users/changePassword:
 *   put:
 *     summary: Change User Password
 *     description: Allows a user to change their password by providing the old and new passwords.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token to authorize the request
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *         required: false
 *         description: Origin of the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "Default@123"
 *               newPassword:
 *                 type: string
 *                 example: "Manish@14"
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully.
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
 *                   example: "Password changed successfully."
 *                 data:
 *                   type: object
 *                   nullable: true
 *       401:
 *         description: Unauthorized or Invalid old password
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
 *                   example: "Invalid old password"
 *                 data:
 *                   type: object
 *                   nullable: true
 *       500:
 *         description: Internal Server Error
 */
router.put('/changePassword', validateToken, sanitizeMiddleware, validateMiddleware(changePasswordSchema), UserController.changePassword);
/**
 * @swagger
 * /api/users/logout:
 *   delete:
 *     summary: Logout User
 *     description: Logs out the user by invalidating the current token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token to authorize the request
 *       - in: header
 *         name: x-request-origin
 *         schema:
 *           type: string
 *         required: false
 *         description: Origin of the request
 *     responses:
 *       200:
 *         description: You have been logged out successfully.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.delete('/logout', validateToken, UserController.logout);
export default router;
