import { Request, Response, NextFunction } from 'express';
import { ErrorMessages } from '../../enums/responseMessages';
import { logger } from '../../utils/logger';

// Load the reCAPTCHA secret key from environment variables
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY!;

/**
 * Middleware to verify Google reCAPTCHA token.
 * 
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
export const captchaMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Extract reCAPTCHA token from the request header
    const recaptchaToken = req.header('X-Recaptcha-Token');

    // Check if the token is provided
    if (!recaptchaToken) {
        logger.warn('Missing reCAPTCHA token');
        return res.status(400).json({
            code: 400,
            success: false,
            message: ErrorMessages.MissingRecaptchaToken,
        });
    }

    try {
        // Prepare the parameters for the reCAPTCHA verification request
        const params = new URLSearchParams({
            'secret': RECAPTCHA_SECRET_KEY,
            'response': recaptchaToken,
        });

        // Make the reCAPTCHA verification request
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        // Parse the response data
        const data = await response.json();
        const { success, score } = data;

        // Check if the reCAPTCHA verification was successful and the score is sufficient
        if (!success || score < 0.5) {
            logger.warn(`Invalid reCAPTCHA token. Score: ${score}`);
            return res.status(400).json({
                code: 400,
                success: false,
                message: ErrorMessages.InvalidRecaptchaToken,
            });
        }

        logger.info('reCAPTCHA verification successful');
        // Proceed to the next middleware/controller if verification is successful
        next();
    } catch (error) {
        // Handle errors during the verification process
        logger.error('reCAPTCHA verification failed', { error });
        res.status(500).json({
            code: 500,
            success: false,
            message: ErrorMessages.RecaptchaVerificationFailed,
        });
    }
};