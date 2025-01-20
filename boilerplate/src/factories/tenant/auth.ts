import AuthCustomerModel from '../../models/tenant/customerModel';
import AuthUtils from '../../helpers/auth/authHelper';
import { ErrorMessages, CustomerMessages } from '../../enums/responseMessages';
import { Knex } from 'knex';
import { TenantCustomer } from '../../interfaces/tenantInterface';
import { formatString } from '../../helpers/tenants/formatters';

class AuthFactory extends AuthUtils {
    private authCustomerModel: AuthCustomerModel;

    /**
     * Creates an instance of AuthFactory.
     * 
     * @param db - The Knex database instance used for querying the database.
     */
    constructor(db: Knex) {
        super();
        // Initialize the AuthCustomerModel with the provided database instance
        this.authCustomerModel = new AuthCustomerModel(db);
    }

    /**
     * Sign up a new customer.
     * 
     * @param customerData - The data for the new customer including personal details and credentials.
     * @returns A promise that resolves to an array of TenantCustomer objects.
     * @throws Will throw an error if there's a database error or if the customer already exists.
     */
    public async signup(customerData: {
        firstName: string;
        lastName: string | null;
        emailId: string;
        countryCode: number;
        phoneNumber: string;
        password: string;
        username: string;
        gender: 'm' | 'f' | 'o';
        profilePic?: string;
        additionalInfo?: object;
        dob?: string;
    }): Promise<TenantCustomer[]> {
        try {
            // Check if a customer with the same email already exists
            if(customerData.emailId){   
                const existingCustomerByEmail = await this.authCustomerModel.getCustomerByField('email_id', customerData.emailId);
                if (existingCustomerByEmail) {
                    throw new Error(CustomerMessages.CustomerAlreadyExists);
                }
            }

            // Check if a customer with the same phone number already exists
            const existingCustomerByPhone = await this.authCustomerModel.getCustomerByField('phone_number', customerData.phoneNumber);
            if (existingCustomerByPhone) {
                throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
            }

            // Check if a customer with the same username already exists, if username is provided
            if (customerData.username) {
                const existingCustomerByUserName = await this.authCustomerModel.getCustomerByField('user_name', customerData.username);
                if (existingCustomerByUserName) {
                    throw new Error(CustomerMessages.UserNameTaken);
                }
            }
            // Hash the customer's password for secure storage
            const hashedPassword = await this.hashPassword(customerData.password);
            // Generate a unique UUID for the new customer
            const customerUUID = await this.generateUUID();
            // Prepare the data for database insertion
            const dbCustomerData = {
                customer_uuid: customerUUID,
                first_name: formatString(customerData.firstName),
                last_name: formatString(customerData.lastName!),
                email_id: customerData.emailId,
                user_name: customerData.username,
                country_code: customerData.countryCode,
                phone_number: customerData.phoneNumber,
                password: hashedPassword,
                customer_gender: 'm',
                profile_pic: customerData.profilePic,
                additional_info: customerData.additionalInfo || null,
                customer_dob: customerData.dob || null,
                created_at: new Date(),
                updated_at: new Date()
            };
            // Insert the new customer into the database and return the result
            return await this.authCustomerModel.createCustomer(dbCustomerData);
        } catch (error: unknown) {
            // Handle known errors and provide specific messages
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerAlreadyExists) {
                    throw new Error(CustomerMessages.CustomerAlreadyExists);
                }
                if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
                    throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
                }
                if (error.message === CustomerMessages.UserNameTaken) {
                    throw new Error(CustomerMessages.UserNameTaken);
                }
                // For other errors during customer creation
                throw new Error(`${CustomerMessages.CreateCustomerFailed}: ${error.message}`);
            }
            // For unknown errors
            throw new Error(ErrorMessages.UnknownError);
        }
    }
}

export default AuthFactory;
