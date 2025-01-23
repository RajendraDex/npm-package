import { Request, Response } from 'express';
import CustomerService from '../../services/tenant/customerService'; // Import the customer service which contains business logic
import { handleResponse } from '../../utils/error'; // Import a utility function to standardize the response structure
import { ResponseCodes } from '../../enums/responseCodes'; // Import an enum that contains HTTP response codes
import { ErrorMessages, CustomerMessages, PromotionMessages } from '../../enums/responseMessages'; // Import enums that contain standardized error and success messages

class CustomerController {
    /**
     * Creates a new customer.
     * This method is responsible for handling the customer creation process.
     * It uses the CustomerService to create a customer and returns the appropriate response.
     * 
     * @param req - The Express request object containing customer data.
     * @param res - The Express response object used to send the response.
     */
    public async createCustomer(req: Request, res: Response): Promise<void> {
        try {
            // Call the service to create a customer
            const customer = await CustomerService.createCustomer(req);

            // Respond with a success message and a 201 status code
            res.status(201).json(handleResponse(null, CustomerMessages.CreateSuccessful, ResponseCodes.CREATED));
        } catch (error: unknown) {
            // Error handling: Differentiate between known and unknown errors
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerAlreadyExists) {
                    // Handle the case where the customer already exists
                    res.status(400).json(handleResponse(null, CustomerMessages.CustomerAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
                    // Handle the case where the phone number already exists
                    res.status(400).json(handleResponse(null, CustomerMessages.PhoneNumberAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else {
                    // Handle generic errors with a 500 status code
                    res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handle unexpected, unknown errors
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Updates a customer's details.
     * This method is responsible for handling the customer update process.
     * It uses the CustomerService to update a customer and returns the appropriate response.
     * 
     * @param req - The Express request object containing customer update data.
     * @param res - The Express response object used to send the response.
     */
    public async updateCustomer(req: Request, res: Response): Promise<void> {
        try {
            // Call the service to update a customer
            const updatedCustomer = await CustomerService.updateCustomer(req);

            // Respond with a success message and a 200 status code
            res.status(200).json(handleResponse(null, CustomerMessages.UpdateSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            // Error handling: Differentiate between known and unknown errors
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerNotFound) {
                    // Handle the case where the customer is not found
                    res.status(404).json(handleResponse(null, CustomerMessages.CustomerNotFound, ResponseCodes.NOT_FOUND));
                } else if (error.message === CustomerMessages.PhoneNumberAlreadyExists) {
                    // Handle the case where the phone number already exists
                    res.status(400).json(handleResponse(null, CustomerMessages.PhoneNumberAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else if (error.message === PromotionMessages.AlreadyAvaildPromotion) {
                    // Handle the case where the promotion is already avalide
                    res.status(400).json(handleResponse(null, PromotionMessages.AlreadyAvaildPromotion, ResponseCodes.BAD_REQUEST));
                } else if (error.message === CustomerMessages.CanNotUpdateCustomer) {
                    // Handle the case where the promotion is already avalide
                    res.status(400).json(handleResponse(null, CustomerMessages.CanNotUpdateCustomer, ResponseCodes.BAD_REQUEST));
                } else {
                    // Handle generic errors with a 500 status code
                    res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handle unexpected, unknown errors
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Retrieves a list of customers.
     * This method handles fetching customer data based on query parameters.
     * It uses the CustomerService to fetch customers and returns the appropriate response.
     * 
     * @param req - The Express request object containing query parameters for fetching customers.
     * @param res - The Express response object used to send the response.
     */
    public async getCustomers(req: Request, res: Response): Promise<void> {
        try {
            // Call the service to fetch customers
            const result = await CustomerService.fetchCustomers(req);
            
            // Respond with the fetched customers and a 200 status code
            res.status(200).json(handleResponse(result, CustomerMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            // Error handling for unexpected errors
            if (error instanceof Error) {
                res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Updates specific fields of a customer's details.
     * This method is responsible for handling partial updates to a customer's details.
     * It uses the CustomerService to update specific fields and returns the appropriate response.
     * 
     * @param req - The Express request object containing customer update data.
     * @param res - The Express response object used to send the response.
     */
    public async updateCustomerFields(req: Request, res: Response): Promise<void> {
        try {
            // Call the service to update customer fields
            const result = await CustomerService.updateCustomerFields(req);

            // Respond with the appropriate message and data
            if (result.success) {
                res.status(200).json(handleResponse(null, result.message, ResponseCodes.OK));
            } else {
                res.status(400).json(handleResponse(null, result.message, ResponseCodes.BAD_REQUEST));
            }
        } catch (error: unknown) {
            // Error handling for unexpected errors
            if (error instanceof Error) {
                res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Fetches a customer by ID.
     * This method is responsible for retrieving a single customer's details by their ID.
     * It uses the CustomerService to fetch the customer and returns the appropriate response.
     * 
     * @param req - The Express request object containing the customer ID in the request parameters.
     * @param res - The Express response object used to send the response.
     */
    public async fetchCustomer(req: Request, res: Response): Promise<void> {
        try {
            // Call the service to fetch a customer by ID
            const customer = await CustomerService.fetchCustomer(req);

            // If customer is found, return the success response
            res.status(200).json(handleResponse(customer, CustomerMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            // Handle specific error scenarios
            if (error instanceof Error) {
                if (error.message === CustomerMessages.CustomerNotFound) {
                    res.status(404).json(handleResponse(null, CustomerMessages.CustomerNotFound, ResponseCodes.NOT_FOUND));
                } else {
                    // Handle unknown errors
                    res.status(500).json(handleResponse(null, `${ErrorMessages.UnknownError}: ${error.message}`, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // General error handling
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }
      /**
   * Exports all customers to CSV format and sends as a downloadable file.
   * 
   * @param req - The Express request object.
   * @param res - The Express response object used to send the response.
   */
  public async exportCustomersToCSV(req: Request, res: Response): Promise<void> {
    try {
      const startTime = Date.now();
      const csv = await CustomerService.exportCustomersToCSV(req);
      const endTime = Date.now();

      const processingTime = endTime - startTime;
      const fileSizeInBytes = Buffer.byteLength(csv, 'utf8');
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

      // Estimate download time (assuming 1 MB/s download speed)
      const estimatedDownloadTime = fileSizeInMB;

      const totalEstimatedTime = processingTime / 1000 + estimatedDownloadTime;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
      res.setHeader('X-Estimated-Download-Time', `${totalEstimatedTime.toFixed(2)} seconds`);

      res.status(200).send(csv);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
      } else {
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  public async deleteCustomerOfferLink(req: Request, res: Response): Promise<void> {
    try {
      await CustomerService.deleteCustomerOfferLink(req);
      res.status(200).json(handleResponse(null, PromotionMessages.DeleteSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if(error instanceof Error){
        if(error.message === CustomerMessages.CustomerNotFound){
          res.status(404).json(handleResponse(null, CustomerMessages.CustomerNotFound, ResponseCodes.NOT_FOUND));
        }
        else if(error.message === PromotionMessages.PromotionNotFound){
          res.status(404).json(handleResponse(null, PromotionMessages.PromotionNotFound, ResponseCodes.NOT_FOUND));
        }
        else if(error.message === ErrorMessages.Unauthorized){
          res.status(401).json(handleResponse(null, ErrorMessages.Unauthorized, ResponseCodes.UNAUTHORIZED));
        }
        else{
          res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      }
      else{
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }
}

export default new CustomerController(); 
