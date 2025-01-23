import { Request } from 'express';
import { ErrorMessages, CustomerMessages } from '../../enums/responseMessages';
import { TenantCustomer } from '../../interfaces/tenantInterface';
import AuthFactory from '../../factories/tenant/auth';

class AuthService {
    /**
     * Sign up a new customer.
     * 
     * @param req - The Express request object containing customer data.
     * @returns A promise that resolves to an array of TenantCustomer objects.
     * @throws Error if the customer already exists or if an internal server error occurs.
     */
    public async signup(req: Request): Promise<TenantCustomer[]> {
        const db = (req as any).knex;
        const customerData = req.body;

        try {
            const authFactory = new AuthFactory(db);
            return await authFactory.signup(customerData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerAlreadyExists) {
                    throw new Error(CustomerMessages.CustomerAlreadyExists);
                }
                throw new Error(error.message || ErrorMessages.InternalServerError);
            }
            throw new Error(ErrorMessages.UnknownError);
        }
    }
}

export default new AuthService();
