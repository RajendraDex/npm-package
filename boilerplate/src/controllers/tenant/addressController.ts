import { Request, Response } from 'express';
import AddressService from '../../services/tenant/addressService';
import { ResponseCodes } from '../../enums/responseCodes';
import { handleResponse } from '../../utils/error';
import { AddressMessages, ErrorMessages } from '../../enums/responseMessages';
import { AddressErrors } from '../../enums/errorMessages';

/**
 * Controller for handling address-related operations.
 * It communicates with the AddressService and returns responses accordingly.
 */
class AddressController {
    /**
     * Adds a new address.
     * This method receives a request with address details, invokes the AddressService to add the address, and sends a response.
     * @param req - Express request object, expected to contain the address data in the body.
     * @param res - Express response object, used to return the result of the addition operation.
     * @returns A JSON response with the result of the addition operation.
     */
    public async addAddress(req: Request, res: Response) {
        try {
            // Calls the service to add an address
            await AddressService.addAddress(req);
            // Returns a success response with a created status code
            return res.status(ResponseCodes.CREATED).json(handleResponse(null, AddressMessages.CreateSuccessful, ResponseCodes.CREATED));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === AddressErrors.AddressAlreadyExists) {
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, AddressErrors.AddressAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else {
                    // Handles unknown errors by returning an internal server error response with a generic message
                    return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handles unknown errors by returning an internal server error response with a generic message
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Updates an existing address.
     * This method receives a request with updated address details, invokes the AddressService to update the address, and sends a response.
     * @param req - Express request object, expected to contain the updated address data in the body.
     * @param res - Express response object, used to return the result of the update operation.
     * @returns A JSON response with the result of the update operation.
     */
    public async updateAddress(req: Request, res: Response) {
        try {
            // Calls the service to update an address
            await AddressService.updateAddress(req);
            // Returns a success response with an OK status code
            return res.status(ResponseCodes.OK).json(handleResponse(null, AddressMessages.UpdateSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Handles specific known errors by returning appropriate status codes and messages
                if (error.message === AddressErrors.AddressNotFound) {
                    // Address not found, return 404 status
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, AddressErrors.AddressNotFound, ResponseCodes.NOT_FOUND));
                } else if (error.message === AddressErrors.AddressIdRequired) {
                    // Address ID is required, return 400 status
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, AddressErrors.AddressIdRequired, ResponseCodes.BAD_REQUEST));
                } else if (error.message === AddressErrors.UnableToUpdateAddress) {
                    // Handles other known errors by returning an internal server error response with the error message
                    return res.status(ResponseCodes.FORBIDDEN).json(handleResponse(null, AddressErrors.UnableToUpdateAddress, ResponseCodes.FORBIDDEN));
                } else if (error.message === AddressErrors.CannotUpdateInactiveAddress) {
                    // Handles other known errors by returning an internal server error response with the error message
                    return res.status(ResponseCodes.FORBIDDEN).json(handleResponse(null, AddressErrors.CannotUpdateInactiveAddress, ResponseCodes.FORBIDDEN));
                } else if (error.message === AddressErrors.AddressAlreadyExists) {
                    // Handles other known errors by returning an internal server error response with the error message
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, AddressErrors.AddressAlreadyExists, ResponseCodes.BAD_REQUEST));
                } else {
                    // Handles other known errors by returning an internal server error response with the error message
                    return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(error.message, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handles unknown errors by returning an internal server error response with a generic message
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Retrieves an address.
     * This method receives a request to fetch an address, invokes the AddressService to get the address, and sends a response.
     * @param req - Express request object, expected to contain the address identifier.
     * @param res - Express response object, used to return the fetched address.
     * @returns A JSON response with the fetched address or an error message.
     */
    public async getAddress(req: Request, res: Response) {
        try {
            // Calls the service to get an address
            const address = await AddressService.getAddress(req);
            // Returns a success response with the fetched address
            return res.status(ResponseCodes.OK).json(handleResponse(address, AddressMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === AddressErrors.AddressNotFound) {
                    // Address not found, return 404 status
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, AddressErrors.AddressNotFound, ResponseCodes.NOT_FOUND));
                } else if (error.message === AddressErrors.AddressIdRequired) {
                    // Address ID is required, return 400 status
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, AddressErrors.AddressIdRequired, ResponseCodes.BAD_REQUEST));
                } else {
                    // Handles other known errors by returning an internal server error response with a generic message
                    return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handles unknown errors by returning an internal server error response with a generic message
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    /**
     * Changes the status of an address.
     * This method receives a request to change the status of an address, invokes the AddressService to update the status, and sends a response.
     * @param req - Express request object, expected to contain the address identifier and new status.
     * @param res - Express response object, used to return the result of the status change operation.
     * @returns A JSON response with the result of the status change operation.
     */
    public async changeStatus(req: Request, res: Response) {
        try {
            // Calls the service to change the status of an address
            await AddressService.changeStatus(req);
            // Returns a success response with an OK status code
            return res.status(ResponseCodes.OK).json(handleResponse(null, AddressMessages.UpdateSuccessful, ResponseCodes.OK));
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === AddressErrors.AddressNotFound) {
                    // Address not found, return 404 status
                    return res.status(ResponseCodes.NOT_FOUND).json(handleResponse(null, AddressErrors.AddressNotFound, ResponseCodes.NOT_FOUND));
                } else if (error.message === AddressErrors.AddressIdRequired) {
                    // Address ID is required, return 400 status
                    return res.status(ResponseCodes.BAD_REQUEST).json(handleResponse(null, AddressErrors.AddressIdRequired, ResponseCodes.BAD_REQUEST));
                } else if (error.message === AddressErrors.CannotUpdateStatus) {
                    // Handles other known errors by returning an internal server error response with a generic message
                    return res.status(ResponseCodes.FORBIDDEN).json(handleResponse(null, AddressErrors.CannotUpdateStatus, ResponseCodes.FORBIDDEN));
                } else {
                    // Handles other known errors by returning an internal server error response with a generic message
                    return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR));
                }
            } else {
                // Handles unknown errors by returning an internal server error response with a generic message
                return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
            }
        }
    }

    public async addressList(req: Request, res: Response) {
        try {
            const address = await AddressService.addressList(req);
            return res.status(ResponseCodes.OK).json(handleResponse(address, AddressMessages.FetchSuccessful, ResponseCodes.OK));
        } catch (error) {
            return res.status(ResponseCodes.INTERNAL_SERVER_ERROR).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR));
        }
    }
}

export default new AddressController();