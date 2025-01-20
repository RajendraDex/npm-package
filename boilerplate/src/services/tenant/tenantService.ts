import { Request } from 'express';
import { ITenant } from '../../interfaces/tenantInterface';
import { ErrorMessages, TenantMessages } from '../../enums/responseMessages';
import TenantFactory from '../../factories/tenant/tenantFactory';

class TenantService {

  /**
   * Creates a new tenant using the provided tenant data.
   * 
   * @param req - The Express request object containing tenant data in the body.
   * @returns A promise that resolves to the created ITenant object.
   * @throws Error if the tenant already exists or if an internal server error occurs.
   */
  public async createTenant(req: Request): Promise<ITenant> {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const tenantData = req.body; // Extract tenant data from the request body

    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
      return await tenantFactory.createTenant(tenantData); // Call createTenant method in TenantFactory
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes(TenantMessages.DomainAlreadyExists)) {
          throw new Error(TenantMessages.TenantAlreadyExists); // Handle specific error for domain already exists
        }
        throw new Error(error.message || ErrorMessages.InternalServerError);
      }
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Fetches a list of tenants with pagination, sorting, and search capabilities.
   * 
   * @param req - The Express request object containing pagination, sorting, search parameters, and status filter in the query.
   * @returns A promise that resolves to a list of tenants based on the query parameters.
   * @throws Error if an internal server error occurs.
   */
  public async fetchTenants(req: Request) {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc', search = '', status } = req.query;

    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
      return await tenantFactory.fetchTenants(
        Number(page), // Convert page to number
        Number(limit), // Convert limit to number
        sortBy as string, // Cast sortBy to string
        sortOrder as 'asc' | 'desc', // Cast sortOrder to 'asc' or 'desc'
        search as string, // Cast search to string
        status ? Number(status) : undefined // Pass status filter if provided, convert to number
      );
    } catch (error: unknown) {
      throw new Error(ErrorMessages.UnknownError);
    }
  }

  /**
   * Fetches a single tenant by its ID.
   * 
   * @param req - The Express request object containing the tenant ID in the params.
   * @returns A promise that resolves to the tenant data or undefined if not found.
   * @throws Error if an internal server error occurs.
   */
  public async fetchTenant(req: Request) {
   
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { tenantId } = req.params; // Extract tenant ID from the request params

    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
      return await tenantFactory.fetchTenant(tenantId); // Call fetchTenant method in TenantFactory
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle specific tenant errors and rethrow them
        if (error.message === TenantMessages.CompanyNotExists) {
          throw new Error(TenantMessages.CompanyNotExists);
        } else if (error.message === TenantMessages.AddressNotFound) {
          throw new Error(TenantMessages.AddressNotFound);
        } else {
          // For all other known errors
          throw new Error(`${ErrorMessages.UnknownError}: ${error.message}`);
        }
      } else {
        // Handle any unknown errors
        throw new Error(ErrorMessages.UnknownError);
      }
    }
  }

  /**
   * Updates the status of a tenant.
   * 
   * @param req - The Express request object containing the tenant ID in the params and the new status in the body.
   * @returns A promise that resolves to the updated tenant data.
   * @throws Error if an internal server error occurs.
   */
  public async updateTenantStatus(req: Request) {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { tenantId } = req.params; // Extract tenant ID from the request params
    const { status } = req.body; // Extract status from the request body
  
    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
      return await tenantFactory.updateTenantStatus(tenantId, status); // Call updateTenantStatus method in TenantFactory
    } catch (error: unknown) {
      throw error; // Re-throw error to be handled by the controller
    }
  }

  /**
   * Updates an existing tenant using the provided tenant ID and data.
   * 
   * @param req - The Express request object containing tenant ID in the params and updated data in the body.
   * @returns A promise that resolves to the updated ITenant object.
   * @throws Error if the tenant does not exist or if an internal server error occurs.
   */
  public async updateTenant(req: Request): Promise<void>{
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { tenantId } = req.params; // Extract tenant ID from the request params
    const tenantData = req.body; // Extract updated tenant data from the request body

    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
     await tenantFactory.updateTenant(tenantId, tenantData); // Call updateTenant method in TenantFactory
     return;
    } catch (error: unknown) {
      throw error; // Re-throw error to be handled by the controller
    }
  }

  /**
   * Retrieves a list of addresses with pagination, sorting, and search capabilities.
   * 
   * @param req - The Express request object containing query parameters for pagination, sorting, and search.
   * @returns A promise that resolves to an object containing the list of addresses and pagination details.
   * @throws Error if an internal server error occurs.
   */
  public async getAddressess(req: Request): Promise<any> {
    const db = (req as any).knex; // Retrieve knex instance
    // Extract pagination, sorting, and search parameters from the query string, with default values
    const { page = 1, limit = -1, sortOrder = 'asc', searchQuery = '' } = req.query;
   const sortBy = 'address_line1'
    try {
        // Use TenantFactory to fetch addresses based on the passed parameters
        const serviceFactory = new TenantFactory(db);
        const result = await serviceFactory.getAddresses(
            Number(page), // Convert page to number
            Number(limit), // Convert limit to number
            sortBy as string, // Cast sortBy to string
            sortOrder as 'asc' | 'desc', // Cast sortOrder to 'asc' or 'desc'
            searchQuery as string // Cast searchQuery to string
        );

        // Transforming the result to map address fields as needed for the response
        const transformedResult = result.result.map((address: any) => ({
            id: address.id,
            AddressLine1: address.address_line1,
            AddressLine2:address.address_line2,
            isPrimaryLocation:address.address_type === 1 ? 1 : 0

        }));

        // Return the transformed result along with pagination details
        return {
            result: transformedResult, // Transformed address list
            totalPages: result.totalPages, // Total number of pages
            currentPage: result.currentPage // Current page number
        };

    } catch (error: unknown) {
        // Error handling for internal server errors
        if (error instanceof Error) {
            throw new Error(ErrorMessages.InternalServerError); // Throw internal server error
        }
        // Fallback to unknown error
        throw new Error(ErrorMessages.UnknownError); // Throw unknown error
    }
  }

  /**
   * Retrieves a list of tenants with pagination, sorting, and search capabilities.
   * 
   * @param req - The Express request object containing query parameters for pagination, sorting, and search.
   * @returns A promise that resolves to the list of tenants.
   * @throws Error if an internal server error occurs.
   */
  public async getTenantList(req: Request): Promise<any> {
    const db = (req as any).knex; // Retrieve knex instance
    // Extract pagination, sorting, and search parameters from the query string, with default values
    const { page = 0, limit = 0, sortOrder = 'asc', searchQuery = '' } = req.query;
    const sortBy = 'tenant_name'; // Default sorting by tenant_name

    try {
      const tenantFactory = new TenantFactory(db); // Create an instance of TenantFactory with Knex instance
      return await tenantFactory.getTenantList(
        Number(page), // Convert page to number
        Number(limit), // Convert limit to number
        sortBy as string, // Cast sortBy to string
        sortOrder as 'asc' | 'desc', // Cast sortOrder to 'asc' or 'desc'
        searchQuery as string // Cast searchQuery to string
      );
    } catch (error) {
      throw error; // Re-throw error to be handled by the controller
    }
  }
  
}

export default new TenantService();
