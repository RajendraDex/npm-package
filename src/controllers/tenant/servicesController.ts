import { Request, Response } from 'express';
import ServiceService from '../../services/tenant/servicesService';
import { ServiceMessages, ErrorMessages } from '../../enums/responseMessages';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';

/**
 * Controller for handling service-related CRUD operations.
 * It communicates with the ServiceService and returns responses accordingly.
 */
class ServiceController {
    
    /**
     * Creates a new service.
     * This method receives a request with service details, invokes the ServiceService to create a new service, and sends a response.
     * @param req - Express request object, expected to contain the service data in the body.
     * @param res - Express response object, used to return the result of the creation operation.
     * @returns A JSON response with the result of the creation operation.
     */
    public async createService(req: Request, res: Response) {
        try {
            await ServiceService.createService(req); // Calls the service to create a service
            return res.status(ResponseCodes.CREATED).json(handleResponse(null, ServiceMessages.CreateSuccessful, ResponseCodes.CREATED));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceAlreadyExists) {
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, ServiceMessages.ServiceAlreadyExists, ResponseCodes.BAD_REQUEST));
                }
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Updates an existing service.
     * This method receives a request with service data, calls the ServiceService to update the service, and sends a response.
     * @param req - Express request object, expected to contain updated service data and service ID in params.
     * @param res - Express response object, used to return the result of the update operation.
     * @returns A JSON response with the result of the update operation.
     */
    public async updateService(req: Request, res: Response) {
        try {
            const result = await ServiceService.updateService(req); // Calls the service to update the service
            // Responds with success if the service is updated
            return res.status(ResponseCodes.OK).json(handleResponse(null, ServiceMessages.ServiceUpdated, ResponseCodes.OK));
        } catch (error: unknown) {
            // Handles known errors like service not found or already exists
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceNotFound) {
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, ServiceMessages.ServiceNotFound, ResponseCodes.NOT_FOUND));
                }
                if (error.message === ServiceMessages.ServiceAlreadyExists) {
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, ServiceMessages.ServiceAlreadyExists, ResponseCodes.BAD_REQUEST));
                }
                // Handles internal server errors
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            // Handles unknown errors
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Retrieves a paginated list of services.
     * @param req - Express request object containing query parameters for pagination, sorting, and search.
     * @param res - Express response object used to return the list of services.
     * @returns A JSON response with the list of services.
     */
    public async getServices(req: Request, res: Response) {
        try {
            const result = await ServiceService.getServices(req);
            return res.status(ResponseCodes.OK).json(handleResponse(result, ServiceMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Changes the status of a service.
     * @param req - Express request object containing the service ID in params and status in the body.
     * @param res - Express response object used to return the result of the status change operation.
     * @returns A JSON response with the result of the status change operation.
     */
    public async changeServiceStatus(req: Request, res: Response) {
        try {
            await ServiceService.changeServiceStatus(req);
            return res.status(ResponseCodes.OK).json(handleResponse(null, ServiceMessages.StatusChangeSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceNotFound) {
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, ServiceMessages.ServiceNotFound, ResponseCodes.NOT_FOUND));
                }
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Retrieves a service by its ID.
     * @param req - Express request object containing the service ID in params.
     * @param res - Express response object used to return the service data.
     * @returns A JSON response with the service data.
     */
    public async getServiceById(req: Request, res: Response) {
        try {
            const result = await ServiceService.getServiceById(req);
            return res.status(ResponseCodes.OK).json(handleResponse(result, ServiceMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceNotFound) {
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, ServiceMessages.ServiceNotFound, ResponseCodes.NOT_FOUND));
                }
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * Deletes an existing service.
     * This method calls ServiceService to delete a service and returns a response.
     * @param req - Express request object, expected to contain the service ID in params and deletion status in the body.
     * @param res - Express response object, used to return the result of the delete operation.
     * @returns A JSON response with the result of the delete operation.
     */
    public async deleteService(req: Request, res: Response) {
        try {
            const { isDeleted } = req.body;
            await ServiceService.deleteService(req); // Calls the service to delete the service

            // Responds with appropriate message based on isDeleted value
            if (isDeleted === 0) {
                return res.status(ResponseCodes.OK).json(handleResponse(null, ServiceMessages.ServiceRecovered, ResponseCodes.OK));
            } else if (isDeleted === 1) {
                return res.status(ResponseCodes.OK).json(handleResponse(null, ServiceMessages.DeleteSuccessful, ResponseCodes.OK));
            }
        } catch (error: unknown) {
            // Handles known errors like service not found
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceNotFound) {
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, ServiceMessages.ServiceNotFound, ResponseCodes.NOT_FOUND));
                }
                // Handles internal server errors
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
            // Handles unknown errors
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }
}

// Exporting an instance of ServiceController
export default new ServiceController();
