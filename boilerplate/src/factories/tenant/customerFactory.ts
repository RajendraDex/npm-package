import CustomerModel from '../../models/tenant/customerModel';
import Model from '../../models/generelisedModel';
import AuthUtils from '../../helpers/auth/authHelper';
import { ErrorMessages, CustomerMessages, PromotionMessages } from '../../enums/responseMessages';
import { calculateAndFormatExpiry, compareDates, formatDate, formatDuration, formatString, maskPhoneNumber } from '../../helpers/tenants/formatters';
import { Knex } from 'knex';
import { TenantCustomer } from '../../interfaces/tenantInterface';

class CustomerFactory extends AuthUtils {
  private customerModel: CustomerModel;
  private model: Model;

  constructor(db: Knex) {
    super();
    // Initialize the CustomerModel with the database instance
    this.customerModel = new CustomerModel(db);
    this.model = new Model(db);
  }

  /**
   * Create a new customer.
   * 
   * @param customerData - The data for the new customer.
   * @returns The newly created customer.
   * @throws Will throw an error if there's a database error.
   */
  public async createCustomer(customerData: {
    firstName: string;
    lastName: string | null;
    emailId: string;
    countryCode: number;
    phoneNumber: string;
    password: string;
    gender: 'm' | 'f' | 'o';
    profilePic?: string;
    otp?: number;
    dob?: string;
    promotionId?: string;
    additionalInfo?: object;
    purchaseDate: string;
    transactionByUserType: string;
    userId: number;
  }): Promise<TenantCustomer[]> {
    try {
      // Check if a customer with the same phone number already exists
      const existingCustomerByPhone = await this.customerModel.getCustomerByField('phone_number', customerData.phoneNumber);
      if (existingCustomerByPhone) {
        // Throw an error if the phone number already exists
        throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
      }

      // Hash the customer's password for security
      const hashedPassword = await this.hashPassword(customerData.password);
      // Generate a unique UUID for the customer
      const customerUUID = await this.generateUUID();

      // Prepare the data to be inserted into the database
      const dbCustomerData = {
        customer_uuid: customerUUID,
        first_name: formatString(customerData.firstName),
        last_name: formatString(customerData.lastName!) || null,
        email_id: customerData.emailId,
        country_code: customerData.countryCode,
        phone_number: customerData.phoneNumber,
        password: hashedPassword,
        customer_gender: customerData.gender,
        profile_pic: customerData.profilePic || null,
        additional_info: customerData.additionalInfo || null,
        otp: customerData.otp || 123456,
        customer_dob: customerData.dob || null,
        created_at: new Date(),
        updated_at: new Date()
      };
      // Insert the new customer into the database and return the result
      const result = await this.customerModel.createCustomer(dbCustomerData);
      let promotionData: any;
      if (customerData.promotionId) {
        const promotion = await this.model.select('promotion_offer', { promotion_uuid: customerData.promotionId }, ['id', 'pay_price', 'get_price', 'offer_duration', 'start_date']);
        if (promotion.length > 0) {
          promotionData = promotion[0];
          // Calculate the expiry date based on the start date and offer duration
          if (!customerData.purchaseDate || customerData.purchaseDate === '') {
            customerData.purchaseDate = new Date().toISOString().split('T')[0];
          }
        }
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error if the customer already exists
        if (error.message === CustomerMessages.CustomerAlreadyExists) {
          throw new Error(CustomerMessages.CustomerAlreadyExists);
        }
        // Handle specific error if the phone number already exists
        if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
          throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
        }
        // Throw a generic error message for other issues
        throw new Error(`${CustomerMessages.CreateCustomerFailed}: ${error.message}`);
      }
      // Throw an unknown error if the error is not an instance of Error
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Update an existing customer.
   * 
   * @param id - The ID of the customer to update.
   * @param customerData - The data to update.
   * @returns The updated customer.
   * @throws Will throw an error if there's a database error.
   */
  public async updateCustomer(id: String, customerData: any): Promise<TenantCustomer[]> {
    try {
      // Check if the customer exists before updating
      const existingCustomer = await this.customerModel.getCustomerById(id);
      if (!existingCustomer) {
        // Throw an error if the customer is not found
        throw new Error(CustomerMessages.CustomerNotFound);
      }

      // Check if a customer with the same phone number already exists
      if (customerData.phoneNumber && customerData.phoneNumber !== existingCustomer.phone_number) {
        const existingCustomerByPhone = await this.customerModel.getCustomerByField('phone_number', customerData.phoneNumber);
        if (existingCustomerByPhone) {
          // Throw an error if the phone number already exists
          throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
        }
      }
      // Format the customer data for updating the database
      const formattedCustomerData = {
        first_name: formatString(customerData.firstName),
        last_name: formatString(customerData.lastName || ''),
        customer_dob: customerData.dob || null,
        email_id: customerData.emailId,
        country_code: customerData.countryCode,
        phone_number: customerData.phoneNumber,
        customer_gender: customerData.gender,
        profile_pic: customerData.profilePic,
        additional_info: customerData.additionalInfo || null,
        updated_at: new Date()
      };


      // Update the customer in the database and return the result
      const result = await this.customerModel.updateCustomer(id, formattedCustomerData);
      let promotionExists = false;
      let promotion: any;
      // Check for existing promotions and update if necessary
      if (customerData.promotionId && customerData.promotionId !== "" && customerData.promotionId !== null) {
        const existingPromotions = await this.model.select('promotion_customer_link', { customer_id: result[0].id, is_deleted: 0 }, ['id', 'promo_id', 'purchase_date', 'expiry_date']);
        promotion = await this.model.select('promotion_offer', { promotion_uuid: customerData.promotionId }, ['id', 'pay_price', 'get_price', 'offer_duration', 'start_date']);
        if (existingPromotions.length > 0) {
          const formattedCurrentDate = formatDate(new Date());
          for (const existingPromotion of existingPromotions) {
            const formattedExpiryDate = formatDate(new Date(existingPromotion.expiry_date));
            // Check if the current date is before the expiry date
            if (compareDates(formattedCurrentDate, formattedExpiryDate) <= 0) {
              if (promotion.length > 0 && promotion[0].id === existingPromotion.promo_id && customerData.purchaseDate === formatDate(new Date(existingPromotion.purchase_date))) {
                promotionExists = true;
                break;
              }
              throw new Error(PromotionMessages.AlreadyAvaildPromotion);
            }
          }
        }
      }
      // Insert new promotion data if provided and not already existing
      if (customerData.promotionId && customerData.promotionId !== "" && customerData.promotionId !== null && !promotionExists) {
        if (promotion.length > 0) {
          const promotionData = promotion[0];
          if (!customerData.purchaseDate || customerData.purchaseDate === '') {
            customerData.purchaseDate = new Date().toISOString().split('T')[0];
          }
          const expiryDate = calculateAndFormatExpiry(customerData.purchaseDate, promotionData.offer_duration);
          const promotionLink = await this.model.insert('promotion_customer_link', {
            customer_id: result[0].id,
            promo_id: promotionData.id,
            purchase_date: formatDate(new Date(customerData.purchaseDate)),
            expiry_date: expiryDate,
            pay_price: promotionData.pay_price,
            get_price: promotionData.get_price,
            consumed_points: 0,
            is_deleted: 0,
            created_at: new Date(),
            updated_at: new Date()
          }, ['id']);
        }
      }
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific error if the customer is not found
        if (error.message === CustomerMessages.CustomerNotFound) {
          throw new Error(CustomerMessages.CustomerNotFound);
        }
        if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
          throw new Error(CustomerMessages.PhoneNumberAlreadyExists);
        }
        if (error.message === PromotionMessages.AlreadyAvaildPromotion) {
          throw new Error(PromotionMessages.AlreadyAvaildPromotion);
        }
        // Throw a generic error message for other issues
        throw new Error(`${CustomerMessages.UpdateCustomerFailed}: ${error.message}`);
      }
      // Throw an unknown error if the error is not an instance of Error
      throw new Error(ErrorMessages.UnknownError);
    }
  }
  /**
   * Fetch customers with pagination, sorting, and searching.
   * 
   * @param page - The current page number.
   * @param limit - The number of customers per page.
   * @param sortBy - The column to sort by.
   * @param sortOrder - The order of sorting, 'asc' or 'desc'.
   * @param search - The search query for filtering customers.
   * @param status - (Optional) The status of the customers to filter by.
   * @param isDeleted - (Optional) Whether to include deleted customers.
   * @returns The paginated list of customers with metadata.
   * @throws Will throw an error if there's a database error.
   */
  public async fetchCustomers(
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc',
    search: string,
    status?: number,
    isDeleted?: number,
    role?: string
  ) {
    try {
      // Fetch customers from the database using the customer model
      const { result, totalPages, currentPage, totalRecords } = await this.customerModel.fetchCustomers(
        page,
        limit,
        sortBy,
        sortOrder,
        search,
        status,
        isDeleted
      );
      // Map the result to the desired format and mask phone numbers if the role is Receptionist
      const formattedResult = result.map(customer => ({
        id: customer.customer_uuid,
        firstName: customer.first_name,
        lastName: customer.last_name || "",
        email: customer.email_id,
        countryCode: customer.country_code,
        phoneNumber: role === 'Receptionist' ? maskPhoneNumber(customer.phone_number) : customer.phone_number,
        customerStatus: customer.customer_status,
        isDeleted: customer.is_deleted,
        dob: customer.customer_dob,
        promotionId: customer.promotion_id || null,
        promotionName: customer.promotion_name || null
      }));
      // Return the formatted result along with pagination metadata
      return {
        result: formattedResult,
        totalPages,
        currentPage,
        totalRecords
      };
    } catch (error) {
      // Propagate the error to be handled by the calling function
      throw error;
    }
  }

  /**
   * Update specific fields of a customer.
   * 
   * @param customerUUID - The UUID of the customer to update.
   * @param fieldsToUpdate - The fields to update and their new values.
   * @returns A success or failure message.
   * @throws Will throw an error if there's a database error.
   */
  public async updateCustomerFields(customerUUID: string, fieldsToUpdate: Partial<{ status: number; isDeleted: number }>) {
    try {
      // Retrieve the customer from the database
      const customer = await this.customerModel.getCustomerById(customerUUID);

      if (!customer) {
        return { success: false, message: `Customer with ID ${customerUUID} not found.` };
      }

      // Update the customer fields
      const result = await this.customerModel.updateCustomerFields(customerUUID, fieldsToUpdate);

      if (result.length === 0) {
        return { success: false, message: CustomerMessages.UpdateCustomerFailed };
      }

      // Handle messaging based on fields updated
      let message = CustomerMessages.UpdateSuccessful;
      if (fieldsToUpdate.isDeleted !== undefined) {
        message = fieldsToUpdate.isDeleted === 1 ? CustomerMessages.CustomerDeleted : CustomerMessages.CustomerRecovered;
      } else if (fieldsToUpdate.status !== undefined) {
        message = CustomerMessages.CustomerStatusChangedSuccessfully;
      }

      return { success: true, message, data: result[0] }; // Returning the first (and likely only) updated customer
    } catch (error) {
      throw new Error(`CustomerFactory updateCustomerFields error: ${error}`);
    }
  }

  /**
   * Fetch a specific customer by ID.
   * 
   * @param id - The ID of the customer to fetch.
   * @returns The customer data.
   * @throws Will throw an error if the customer is not found or if there's a database error.
   */
  public async fetchCustomer(id: String, role?: string) {
    try {
      // Retrieve the customer from the database
      const customer = await this.customerModel.getCustomerById(id);
      if (!customer) {
        // Throw an error if the customer is not found
        throw new Error(CustomerMessages.CustomerNotFound);
      }
      let offerDetails: any;
      if (customer.promotions.length > 0) {
        offerDetails = {
          id: customer.promotions[0].promotion_uuid,
          promotionName: customer.promotions[0].promotion_name,
          payPrice: `₹${customer.promotions[0].pay_price}`,
          getPrice: `₹${customer.promotions[0].get_price}`,
          offerDuration: formatDuration(customer.promotions[0].offer_duration),
          expiryDate: customer.promotions[0].expiry_date,
          purchaseDate: customer.promotions[0].purchase_date
        }
      }
      return {
        id: customer.customer_uuid,
        firstName: customer.first_name,
        lastName: customer.last_name || "",
        emailId: customer.email_id,
        gender: customer.customer_gender,
        profilePic: customer.profile_pic,
        countryCode: customer.country_code,
        phoneNumber: role === 'Receptionist' ? maskPhoneNumber(customer.phone_number) : customer.phone_number,
        status: customer.customer_status,
        isDeleted: customer.is_deleted,
        additionalInfo: customer.additional_info,
        createdAt: customer.created_at,
        dob: customer.customer_dob,
        offerDetails: offerDetails || null
      };
    } catch (error) {
      // Propagate the error to be handled by the calling function
      throw error;
    }
  }
  /**
  * Fetch all customers for CSV export.
  * 
  * @returns Promise<TenantCustomer[]> All customers in the database.
  */
  public async fetchAllCustomersForExport(): Promise<TenantCustomer[]> {
    try {
      return await this.customerModel.getCustomers();
    } catch (error) {
      throw new Error(`Error fetching customers for export: ${error}`);
    }
  }
}

export default CustomerFactory;
