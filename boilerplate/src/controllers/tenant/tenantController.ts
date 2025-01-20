import { Request, Response } from 'express';
import TenantService from '../../services/tenant/tenantService';
import { handleResponse } from '../../utils/error';
import { ResponseCodes } from '../../enums/responseCodes';
import { ErrorMessages, TenantMessages } from '../../enums/responseMessages';

class TenantController {
  // Controller method to handle the creation of a new tenant
  public async createTenant(req: Request, res: Response) {
    try {
      // Call the TenantService to create a new tenant with the request data
      await TenantService.createTenant(req);

      // If successful, respond with a 201 status code and success message
      res.status(201).json(handleResponse(null, TenantMessages.CreateSuccessful, ResponseCodes.CREATED));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If the error message indicates the tenant already exists, respond with a 400 status code
        if (error.message === TenantMessages.TenantAlreadyExists) {
          res.status(409).json(handleResponse(null, error.message, ResponseCodes.CONFLICT));
        } else {
          // For other errors, respond with a 500 status code and the error message
          res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        // Handle any unknown errors with a 500 status code
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method to retrieve a list of tenants
  public async getTenants(req: Request, res: Response) {
    try {
      // Call the TenantService to fetch the list of tenants based on the request data
      const result = await TenantService.fetchTenants(req);

      // If successful, respond with a 200 status code and the retrieved tenant data
      res.status(200).json(handleResponse(result, TenantMessages.CompaniesFetched, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Handle errors by responding with a 500 status code and the error message
        res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
      } else {
        // Handle any unknown errors with a 500 status code
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method to retrieve a specific tenant by ID or other criteria
  public async getTenant(req: Request, res: Response) {
    try {
      // Call the TenantService to fetch a specific tenant's details based on the request data
      const result = await TenantService.fetchTenant(req);

      // If successful, respond with a 200 status code and the tenant data
      res.status(200).json(handleResponse(result, TenantMessages.Fetched, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === TenantMessages.CompanyNotExists) {
            res.status(400).json(handleResponse(null, TenantMessages.CompanyNotExists, ResponseCodes.BAD_REQUEST));
        } else if (error.message === TenantMessages.AddressNotFound) {
            res.status(400).json(handleResponse(null, TenantMessages.AddressNotFound, ResponseCodes.BAD_REQUEST));
        }else {
            res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    } else {
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
    }
  }

  // Controller method to update the status of a tenant
  public async updateTenantStatus(req: Request, res: Response) {
    try {
      // Call the TenantService to update the status of a tenant based on the request data
       await TenantService.updateTenantStatus(req);
  
      // If successful, respond with a 200 status code and a success message
      res.status(200).json(handleResponse(null, TenantMessages.StatusUpdateSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('Tenant with ID')) {
          // Handle tenant not found error with a 404 status code
          res.status(404).json(handleResponse(null, error.message, ResponseCodes.NOT_FOUND));
        } else {
          // Handle other errors by responding with a 500 status code and the error message
          res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        // Handle any unknown errors with a 500 status code
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }

  // Controller method to update an existing tenant
  public async updateTenant(req: Request, res: Response) {
    try {
      // Call the TenantService to update the tenant with the request data
      await TenantService.updateTenant(req);

      // If successful, respond with a 200 status code and the updated tenant data
      res.status(200).json(handleResponse(null, TenantMessages.UpdateSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === TenantMessages.CompanyNotExists) {
          res.status(404).json(handleResponse(null, TenantMessages.CompanyNotExists, ResponseCodes.NOT_FOUND));
        }
        else if (error.message === TenantMessages.TenantAlreadyExists) {
          res.status(409).json(handleResponse(null, TenantMessages.TenantAlreadyExists, ResponseCodes.CONFLICT));
        } else {
          res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
      } else {
        res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
      }
    }
  }
  
  public async getAddressses(req: Request, res: Response) {
    try {
        const result = await TenantService.getAddressess(req);
        return res.status(ResponseCodes.OK).json(handleResponse(result, TenantMessages.AddressFetchSuccessful, ResponseCodes.OK));
    } catch (error: unknown) {
        if (error instanceof Error) {
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
        return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
    }
}


  
}

export default new TenantController();
