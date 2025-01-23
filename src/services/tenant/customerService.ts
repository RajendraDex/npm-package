import { Request } from 'express';
import CustomerFactory from '../../factories/tenant/customerFactory';
import { ErrorMessages, CustomerMessages, PromotionMessages } from '../../enums/responseMessages';
import { TenantCustomer } from '../../interfaces/tenantInterface';
import { Parser } from 'json2csv';

class CustomerService {
  /**
   * Creates a new customer using the provided customer data.
   * 
   * @param req - The Express request object containing customer data in the body.
   * @returns A promise that resolves to an array of TenantCustomer objects.
   * @throws Error if the customer already exists or if an internal server error occurs.
   */
  public async createCustomer(req: Request): Promise<TenantCustomer[]> {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const role = req.role;
    const userId = req.userInfo?.id;
    let customerData = req.body; // Extract customer data from the request body
    customerData.transactionByUserType = role;
    customerData.userId = userId;
    try {
      const customerFactory = new CustomerFactory(db); // Create an instance of CustomerFactory with Knex instance
      return await customerFactory.createCustomer(customerData); // Call createCustomer method in CustomerFactory
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === CustomerMessages.CustomerAlreadyExists) {
          throw new Error(CustomerMessages.CustomerAlreadyExists); // Throw specific error if customer already exists
        }
        throw new Error(error.message || ErrorMessages.InternalServerError); // Throw general error if something else goes wrong
      }
      throw new Error(ErrorMessages.UnknownError); // Throw unknown error if error type is not known
    }
  }

  /**
   * Updates customer details.
   * 
   * @param req - The Express request object containing customer ID and update data.
   * @returns A promise that resolves to the updated customer.
   * @throws Error if the customer is not found or if an internal server error occurs.
   */
  public async updateCustomer(req: Request): Promise<TenantCustomer[]> {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { id } = req.params; // Extract customer ID from request parameters
    const customerData = req.body; // Extract update data from the request body
    customerData.transactionByUserType = req.role;
    customerData.userId = req.userInfo?.id;

    try {
      const customerFactory = new CustomerFactory(db); // Create an instance of CustomerFactory with Knex instance
      return await customerFactory.updateCustomer(id, customerData); // Call updateCustomer method in CustomerFactory
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === CustomerMessages.CustomerNotFound) {
          throw new Error(CustomerMessages.CustomerNotFound); // Throw specific error if customer not found
        }
        if (error.message === PromotionMessages.AlreadyAvaildPromotion) {
          throw new Error(PromotionMessages.AlreadyAvaildPromotion);
        }
        throw new Error(error.message || ErrorMessages.InternalServerError); // Throw general error if something else goes wrong
      }
      throw new Error(ErrorMessages.UnknownError); // Throw unknown error if error type is not known
    }
  }

  /**
   * Fetches customers based on query parameters.
   * 
   * @param req - The Express request object containing query parameters.
   * @returns A promise that resolves to the fetched customer data.
   * @throws Error if an unknown error occurs.
   */
  public async fetchCustomers(req: Request) {
    const role = req.role;
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search = '',
      status,
      isDeleted
    } = req.query; // Extract query parameters with defaults

    try {
      const customerFactory = new CustomerFactory(db); // Create an instance of CustomerFactory with Knex instance
      return await customerFactory.fetchCustomers(
        Number(page), // Convert page to number
        Number(limit), // Convert limit to number
        sortBy as string, // Cast sortBy to string
        sortOrder as 'asc' | 'desc', // Cast sortOrder to 'asc' or 'desc'
        search as string, // Cast search to string
        status ? Number(status) : undefined, // Pass status filter if provided, convert to number
        isDeleted ? Number(isDeleted) : undefined, // Pass isDeleted filter if provided, convert to number
        role as string
      );
    } catch (error) {
      throw new Error(ErrorMessages.UnknownError); // Throw unknown error if something goes wrong
    }
  }

  /**
   * Updates specific fields of a customer.
   * 
   * @param req - The Express request object containing the fields to update and the customer ID.
   * @returns A promise that resolves to the result of the update operation.
   * @throws Error if an unknown error occurs.
   */
  public async updateCustomerFields(req: Request) {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { status, isDeleted, customerId } = req.body; // Extract status and isDeleted from the request body

    try {
      const customerFactory = new CustomerFactory(db); // Create an instance of CustomerFactory with Knex instance

      // Create an object with fields to update
      const fieldsToUpdate: Partial<{ status: number; isDeleted: number }> = {};

      if (status !== undefined && req.method === 'PATCH') {
        fieldsToUpdate.status = status; // Add status to fieldsToUpdate if defined
      }
      if (isDeleted !== undefined && req.method === 'DELETE') {
        fieldsToUpdate.isDeleted = isDeleted; // Add isDeleted to fieldsToUpdate if defined
      }

      // Call updateCustomerFields method in CustomerFactory
      const result = await customerFactory.updateCustomerFields(customerId, fieldsToUpdate);

      // Return the result with the appropriate message
      return result;
    } catch (error: unknown) {
      throw new Error(ErrorMessages.UnknownError); // Throw unknown error if something goes wrong
    }
  }

  /**
   * Fetches a specific customer by ID.
   * 
   * @param req - The Express request object containing the customer ID in the parameters.
   * @returns A promise that resolves to the customer data.
   * @throws Error if the customer is not found or if an internal server error occurs.
   */
  public async fetchCustomer(req: Request) {
    const role = req.role;
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { id } = req.params; // Extract customer ID from request parameters

    try {
      const customerFactory = new CustomerFactory(db); // Create an instance of CustomerFactory with Knex instance
      const result = await customerFactory.fetchCustomer(id, role as string); // Call fetchCustomer method in CustomerFactory
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error if the customer is not found
        if (error.message === CustomerMessages.CustomerNotFound) {
          throw new Error(CustomerMessages.CustomerNotFound);
        }
      }
      throw new Error(ErrorMessages.UnknownError); // Throw unknown error if error type is not known
    }
  }
  /**
  * Exports all customers to CSV format.
  * 
  * @param req - The Express request object.
  * @returns A promise that resolves to the CSV data as a string.
  * @throws Error if an unknown error occurs.
  */
  public async exportCustomersToCSV(req: Request): Promise<string> {
    const db = (req as any).knex;

    try {
      const customerFactory = new CustomerFactory(db);
      const customers = await customerFactory.fetchAllCustomersForExport();
      const fields = [
        { label: 'id', value: 'customer_uuid' },
        { label: 'First Name', value: 'first_name' },
        { label: 'Last Name', value: 'last_name' },
        { label: 'Email', value: 'email_id' },
        { label: 'Country Code', value: 'country_code' },
        { label: 'Phone Number', value: 'phone_number' },
        { label: 'Status', value: 'customer_status' }
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(customers);

      return csv;
    } catch (error: unknown) {
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  public async deleteCustomerOfferLink(req: Request) {
    const db = (req as any).knex;
    const role = req.role;
    const { promotionId, customerId } = req.body;
    const customerFactory = new CustomerFactory(db);
    const userId = req.userInfo?.id;
    try {
      if (role === 'Admin' || role === 'Super Admin') {
        // TODO: Implement this function
        // return await customerFactory.deleteCustomerOfferLink(promotionId, customerId,userId!,role); 
      } else {
        throw new Error(ErrorMessages.Unauthorized);
      }
    } catch (error: unknown) {
      throw error;
    }
  }
}

export default new CustomerService();
