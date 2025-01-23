import { Request, Response } from 'express';
import AuthService from '../../services/tenant/auth';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';
import { ErrorMessages, CustomerMessages } from '../../enums/responseMessages';

class AuthController {
    /**
     * Sign up a new customer.
     * 
     * @param req - The Express request object containing customer data.
     * @param res - The Express response object used to send the response.
     */
    public async signup(req: Request, res: Response): Promise<void> {
        try {
            const customer = await AuthService.signup(req);

            res.status(201).json(handleResponse(null, CustomerMessages.CreateSuccessful, ResponseCodes.CREATED));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerAlreadyExists) {
                    res.status(400).json(handleResponse(null, CustomerMessages.CustomerAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
                    res.status(400).json(handleResponse(null, CustomerMessages.PhoneNumberAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else if (error.message === CustomerMessages.UserNameTaken) {
                    res.status(400).json(handleResponse(null, CustomerMessages.UserNameTaken, ResponseCodes.BAD_REQUEST))
                } else {
                    res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }
}

export default new AuthController();
