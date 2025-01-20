import Model from '../../models/generelisedModel';
import { ServiceMessages, ErrorMessages } from '../../enums/responseMessages'; // Added import for error messages
import { Knex } from 'knex';
import AuthUtils from '../../helpers/auth/authHelper'; // Import AuthUtils for token-related functions
import ServiceModel from '../../models/tenant/serviceModel';

/**
 * ServiceFactory class handles CRUD operations related to services.
 * It extends AuthUtils for token-based functionality.
 */
class ServiceFactory extends AuthUtils {
    private serviceModel: Model;
    private serviceListModel: ServiceModel;

    /**
     * Constructor to initialize the ServiceFactory with database connection.
     * @param db - The Knex database instance.
     */
    constructor(db: Knex) {
        super(); // Call the parent class constructor to initialize AuthUtils
        this.serviceModel = new Model(db); // Initialize the general model to interact with the database
        this.serviceListModel = new ServiceModel(db); // Initialize the service list model
    }

    /**
     * Creates a new service in the database.
     * @param data - The service data from the request.
     * @param token - The authentication token of the user creating the service.
     * @returns A promise that resolves when the service is created.
     * @throws Error if service already exists or other issues occur.
     */
    public async createService(data: any, token: string) {
        try {
            // Check if the service with the same name already exists
            const existingService = await this.serviceModel.select('tenant_service', { service_name: data.service_name }, ['id']);
            if (existingService.length > 0) {
                throw new Error(ServiceMessages.ServiceAlreadyExists); // Custom error for existing service
            }

            // Verify the provided token and retrieve user details
            const decodedToken = this.verifyToken(token); // Verify token
            const user = decodedToken.id; // Assuming the user ID is stored in the token

            // Fetch the ID of the user creating the service from the 'tenant_staff' table
            const userId = await this.serviceModel.select('tenant_staff', { staff_uuid: user }, ['id']);

            // Generate a UUID for the service and set the 'created_by' field
            data.service_uuid = this.generateUUID(); // Add UUID to data
            data.created_by = userId[0]?.id || 1; // Fallback to default user ID if necessary

            // Convert service_category_ids to JSON string
            if (Array.isArray(data.service_category_ids)) {
                data.service_category_ids = JSON.stringify(data.service_category_ids);
            }

            // Convert service_image to JSON string
            if (Array.isArray(data.service_image)) {
                data.service_image = JSON.stringify(data.service_image);
            }

            // Insert the new service into the database
            return await this.serviceModel.insert('tenant_service', data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors for handling in the controller
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }

    /**
     * Updates an existing service in the database.
     * @param id - The UUID of the service to be updated.
     * @param data - The updated service data.
     * @returns A promise that resolves when the service is updated.
     * @throws Error if the service does not exist or the name already exists.
     */
    public async updateService(id: string, data: any): Promise<any> {
        try {
            // Check if the service exists based on the UUID
            const existingService = await this.serviceModel.select('tenant_service', { service_uuid: id }, ['id', 'service_name']);
            if (existingService.length === 0) {
                throw new Error(ServiceMessages.ServiceNotFound); // Custom error for service not found
            }

            // Check if the updated service name is different from the existing one
            if (existingService[0].service_name !== data.service_name) {
                // Check if the updated service name already exists in the database for another service
                const serviceNameExists = await this.serviceModel.select('tenant_service', { service_name: data.service_name }, ['id']);
                if (serviceNameExists.length > 0) {
                    throw new Error(ServiceMessages.ServiceAlreadyExists); // Custom error for existing service name
                }
            }

            // Convert service_category_ids to JSON string
            if (Array.isArray(data.service_category_ids)) {
                data.service_category_ids = JSON.stringify(data.service_category_ids);
            }

            // Convert service_image to JSON string
            if (Array.isArray(data.service_image)) {
                data.service_image = JSON.stringify(data.service_image);
            }

            // Update the service in the database
            return await this.serviceModel.update('tenant_service', 'service_uuid', id, data);

        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }

    /**
     * Changes the status of a service (e.g., active/inactive).
     * @param id - The UUID of the service.
     * @param status - The new status to be applied.
     * @returns A promise that resolves when the status is updated.
     * @throws Error if the service is not found.
     */
    public async changeServiceStatus(id: string, status: string): Promise<any> {
        try {
            // Check if the service exists by UUID
            const existingService = await this.serviceModel.select('tenant_service', { service_uuid: id }, ['id']);
            if (existingService.length === 0) {
                throw new Error(ServiceMessages.ServiceNotFound); // Custom error for service not found
            }

            // Update the service's status in the database
            const result = await this.serviceModel.update('tenant_service', 'service_uuid', id, { service_status: status });
            return result;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }

    /**
     * Retrieves a service by its UUID.
     * @param id - The UUID of the service to retrieve.
     * @returns A promise that resolves with the service data.
     * @throws Error if the service is not found.
     */
    public async getServiceById(id: string): Promise<any> {
        try {
            // Fetch the service data from the database
            const service = await this.serviceModel.select('tenant_service', { service_uuid: id }, [
                'service_name', 'service_description', 'service_price', 'service_category_ids', 'service_image', 'service_status', 'created_by', 'service_duration'
            ]);
            if (service.length === 0) {
                throw new Error(ServiceMessages.ServiceNotFound); // Custom error for service not found
            }

            // Parse service_category_ids
            let categoryIds = [];
            if (typeof service[0].service_category_ids === 'string') {
                try {
                    categoryIds = JSON.parse(service[0].service_category_ids);
                } catch (parseError) {
                    categoryIds = [];
                }
            } else if (Array.isArray(service[0].service_category_ids)) {
                categoryIds = service[0].service_category_ids;
            }

            // Fetch categories for each ID
            const categories = [];
            for (const categoryId of categoryIds) {
                const category = await this.serviceModel.select('tenant_service_categories', { service_category_uuid: categoryId }, ['service_category_uuid', 'category_name']);
                if (category.length > 0) {
                    categories.push({
                        id: category[0].service_category_uuid, // Include UUID as id
                        name: category[0].category_name
                    });
                }
            }
            service[0].categories = categories;

            delete service[0].service_category_ids; // Remove the original category IDs field

            return service[0];
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }

    /**
     * Retrieves a paginated list of services from the database.
     * @param page - The current page number for pagination.
     * @param limit - The number of services to retrieve per page.
     * @param sortBy - The column to sort by.
     * @param sortOrder - The order of sorting ('asc' or 'desc').
     * @param searchQuery - The search string to filter the services.
     * @param isDeleted - The deletion status to filter by.
     * @param status - The status to filter by.
     * @returns A promise that resolves with the services, total pages, and the current page.
     */
    public async getServices(page: number, limit: number, sortBy: string, sortOrder: 'asc' | 'desc', searchQuery: string, isDeleted: number, status: number): Promise<{ result: any[], totalPages: number, currentPage: number , totalRecords: number}> {
        try {
            // Fetch the data with pagination, sorting, and search capabilities
            const { services, totalPages, currentPage, totalRecords } = await this.serviceListModel.fetchServices(page, limit, sortBy, sortOrder, searchQuery, isDeleted, status);
            for (const service of services) {
                try {
                    let categoryIds = [];
                    // Check if service_category_ids is already an array
                    if (Array.isArray(service.service_category_ids)) {
                        categoryIds = service.service_category_ids;
                    } else if (typeof service.service_category_ids === 'string') {
                        categoryIds = JSON.parse(service.service_category_ids);
                    }

                    // Fetch categories for each ID
                    const categories = [];
                    for (const categoryId of categoryIds) {
                        const category = await this.serviceModel.select('tenant_service_categories', { service_category_uuid: categoryId }, ['service_category_uuid', 'category_name']);
                        if (category.length > 0) {
                            categories.push({
                                id: category[0].service_category_uuid, // Include UUID as id
                                name: category[0].category_name
                            });
                        }
                    }
                    service.categories = categories;

                    delete service.service_category_ids; // Remove the original category IDs field
                } catch (parseError) {
                    service.categories = [];
                }
            }

            return { result: services, totalPages, currentPage, totalRecords };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }

    /**
     * Soft deletes a service by setting its is_deleted status.
     * @param id - The UUID of the service to delete.
     * @param isDeleted - The deletion status to be applied (true/false).
     * @returns A promise that resolves when the service's status is updated.
     * @throws Error if the service is not found.
     */
    public async deleteService(id: string, isDeleted: boolean): Promise<any> {
        try {
            // Check if the service exists by UUID
            const existingService = await this.serviceModel.select('tenant_service', { service_uuid: id }, ['id']);
            if (existingService.length === 0) {
                throw new Error(ServiceMessages.ServiceNotFound); // Custom error for service not found
            }

            // Update the service's is_deleted status in the database
            const result = await this.serviceModel.update('tenant_service', 'service_uuid', id, { is_deleted: isDeleted });
            return result;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw error; // Rethrow known errors
            }
            throw new Error(ErrorMessages.UnknownError); // Handle unknown errors
        }
    }
}

export default ServiceFactory;