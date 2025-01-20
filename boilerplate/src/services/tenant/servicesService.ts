import { Request } from 'express';
import ServiceFactory from '../../factories/tenant/servicesFactory'; // Importing the factory for service-related operations
import { ErrorMessages, ServiceMessages } from '../../enums/responseMessages'; // Importing custom error and success messages
import { convertToCamelCase, formatString } from '../../helpers/tenants/formatters';

/**
 * ServiceService handles all the business logic for services.
 * It interacts with the ServiceFactory to perform database operations
 * like creating, updating, fetching, and changing the status of services.
 */
class ServiceService {

    /**
     * createService is responsible for creating a new service.
     * 
     * @param req - Express request object containing the body with service data.
     * @returns The created service or throws an error.
     */
    public async createService(req: Request) {
        const data = req.body;
        const db = (req as any).knex; // Retrieve knex instance for database interaction
        const token = req.headers.authorization?.split(' ')[1]; // Extract JWT token from headers if present

        // Mapping camelCase fields from the request body to snake_case used in the database
        const formattedData = {
            service_name: formatString(data.serviceName),
            service_description: data.serviceDescription,
            service_price: data.servicePrice,
            service_category_ids: data.serviceCategoryIds,
            service_image: data.serviceImage,
            service_duration: data.serviceDuration // Assuming serviceDuration is in minutes
        };

        try {
            const serviceFactory = new ServiceFactory(db);
            return await serviceFactory.createService(formattedData, token!);
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceAlreadyExists) {
                    throw new Error(ServiceMessages.ServiceAlreadyExists);
                }
                throw new Error(ErrorMessages.InternalServerError);
            }
            throw new Error(ErrorMessages.UnknownError);
        }
    }

    /**
     * updateService handles updating an existing service.
     * 
     * @param req - Express request object containing the service id in params and updated data in the body.
     * @returns The updated service or throws an error.
     */
    public async updateService(req: Request): Promise<any> {
        const serviceId = req.params.id; // Retrieve the service ID from the request parameters
        const data = req.body; // Extract updated service data from the request body
        const db = (req as any).knex; // Retrieve knex instance

        // Map camelCase fields from the request body to snake_case for database use
        const formattedData = {
            service_name: formatString(data.serviceName),
            service_description: data.serviceDescription,
            service_price: data.servicePrice,
            service_category_ids: data.serviceCategoryIds,
            service_image: data.serviceImage,
            service_duration: data.serviceDuration // Assuming serviceDuration is in minutes
        };

        // Remove fields that are undefined
        const filteredData = Object.fromEntries(
            Object.entries(formattedData).filter(([_, value]) => value !== undefined)
        );

        try {
            // Use ServiceFactory to update the service
            const serviceFactory = new ServiceFactory(db);
            const updatedService = await serviceFactory.updateService(serviceId, filteredData);

            // Return the updated service
            return updatedService;
        } catch (error: unknown) {
            // Error handling for service already existing
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceAlreadyExists) {
                    throw new Error(ServiceMessages.ServiceAlreadyExists);
                }
                // Rethrow any other known errors
                throw error;
            }
            // Fallback to unknown error
            throw new Error(ErrorMessages.UnknownError);
        }
    }

    /**
     * getServices handles retrieving services with pagination, sorting, and search functionality.
     * 
     * @param req - Express request object containing query parameters for pagination, sorting, and search.
     * @returns A paginated list of services along with total pages and current page.
     */
    public async getServices(req: Request): Promise<any> {
        const db = (req as any).knex; // Retrieve knex instance
        // Extract pagination, sorting, and search parameters from the query string, with default values
        const { page = 1, limit = 10, sortBy = 'service_name', sortOrder = 'asc', search = '', isDeleted = 2 ,status =2} = req.query;

        try {
            // Use ServiceFactory to fetch services based on the passed parameters
            const serviceFactory = new ServiceFactory(db);
            const result = await serviceFactory.getServices(
                Number(page),
                Number(limit),
                sortBy as string,
                sortOrder as 'asc' | 'desc',
                search as string,
                isDeleted as number,
                status as number

            );

            // Convert all fields to camelCase and rename serviceUuid to id
            const transformedResult = result.result.map((service: any) => {
                const camelCaseService = convertToCamelCase(service);
                camelCaseService.id = camelCaseService.serviceUuid;
                delete camelCaseService.serviceUuid;

                // Convert categories to camelCase
                camelCaseService.categories = camelCaseService.categories.map((category: any) => convertToCamelCase(category));

                return camelCaseService;
            });

            // Return the transformed result along with pagination details
            return {
                result: transformedResult,
                totalPages: result.totalPages,
                currentPage: result.currentPage,
                totalRecords: result.totalRecords
            };

        } catch (error: unknown) {
            // Error handling for internal server errors
            if (error instanceof Error) {
                throw new Error(ErrorMessages.InternalServerError);
            }
            // Fallback to unknown error
            throw new Error(ErrorMessages.UnknownError);
        }
    }

    /**
     * changeServiceStatus handles updating the status (e.g., active/inactive) of a service.
     * 
     * @param req - Express request object containing the service ID in params and status in the body.
     * @returns The updated service or throws an error if not found.
     */
    public async changeServiceStatus(req: Request): Promise<any> {
        const serviceId = req.params.id; // Retrieve service ID from request params
        const { status } = req.body; // Extract status from the request body
        const db = (req as any).knex; // Retrieve knex instance

        try {
            // Use ServiceFactory to change the service's status
            const serviceFactory = new ServiceFactory(db);
            const updatedService = await serviceFactory.changeServiceStatus(serviceId, status);

            // If the service is not found, throw a 'Service not found' error
            if (!updatedService) {
                throw new Error(ServiceMessages.ServiceNotFound);
            }
            // Return the updated service
            return;
        } catch (error: unknown) {
            // Error handling for known errors
            if (error instanceof Error) {
                throw error;
            }
            // Fallback to unknown error
            throw new Error(ErrorMessages.UnknownError);
        }
    }

    /**
     * getServiceById handles retrieving a service by its ID.
     * 
     * @param req - Express request object containing the service ID in params.
     * @returns The service data or throws an error.
     */
    public async getServiceById(req: Request): Promise<any> {
        const serviceId = req.params.id; // Retrieve the service ID from the request parameters
        const db = (req as any).knex; // Retrieve knex instance
        try {
            // Use ServiceFactory to fetch the service by ID
            const serviceFactory = new ServiceFactory(db);
            const service = await serviceFactory.getServiceById(serviceId);

            // Convert all fields to camelCase
            const camelCaseService = convertToCamelCase(service);

            // Convert categories to camelCase
            camelCaseService.categories = camelCaseService.categories.map((category: any) => convertToCamelCase(category));

            return camelCaseService;

        } catch (error: unknown) {
            // Error handling
            if (error instanceof Error) {
                if (error.message === ServiceMessages.ServiceNotFound) {
                    throw new Error(ServiceMessages.ServiceNotFound);
                }
                throw new Error(ErrorMessages.InternalServerError);
            }
            throw new Error(ErrorMessages.UnknownError);
        }
    }

    /**
     * deleteService handles the deletion (soft delete) of a service.
     * 
     * @param req - Express request object containing the service ID in params and deletion status in the body.
     * @returns The updated service or throws an error if not found.
     */
    public async deleteService(req: Request): Promise<any> {
        const serviceId = req.params.id; // Retrieve service ID from request params
        const { isDeleted } = req.body; // Extract isDeleted status from the request body
        const db = (req as any).knex; // Retrieve knex instance

        try {
            // Use ServiceFactory to change the service's status
            const serviceFactory = new ServiceFactory(db);
            const deletedService = await serviceFactory.deleteService(serviceId, isDeleted);

            // If the service is not found, throw a 'Service not found' error
            if (!deletedService) {
                throw new Error(ServiceMessages.ServiceNotFound);
            }
            // Return the updated service
            return deletedService;
        } catch (error: unknown) {
            // Error handling for known errors
            if (error instanceof Error) {
                throw error;
            }
            // Fallback to unknown error
            throw new Error(ErrorMessages.UnknownError);
        }
    }
}

// Exporting an instance of ServiceService
export default new ServiceService();