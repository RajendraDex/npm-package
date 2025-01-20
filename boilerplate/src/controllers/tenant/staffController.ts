import { Request, Response } from 'express'; // Express request and response types
import StaffService from '../../services/tenant/staffService'; // Import the staff service
import { handleResponse } from '../../utils/error'; // Import a utility function to standardize the response structure
import { ResponseCodes } from '../../enums/responseCodes'; // Import an enum that contains HTTP response codes
import { ErrorMessages, StaffMessages } from '../../enums/responseMessages'; // Import enums for messages

class StaffController {
    /**
     * Creates a new staff member.
     * 
     * @param req - The Express request object containing staff data.
     * @param res - The Express response object used to send the response.
     */
    public async createStaff(req: Request, res: Response): Promise<void> {
        try {
            await StaffService.createStaff(req); // Call the service to create a staff member
            res.status(201).json(handleResponse(null, StaffMessages.CreateSuccessful, ResponseCodes.CREATED)); // Success response
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffAlreadyExists) {
                    res.status(400).json(handleResponse(null, StaffMessages.StaffAlreadyExists, ResponseCodes.BAD_REQUEST)); // Handle existing staff error
                } else {
                    res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Generic error
                }
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Unknown error
            }
        }
    }

    /**
     * Updates a staff member's details.
     * 
     * @param req - The Express request object containing staff update data.
     * @param res - The Express response object used to send the response.
     */
    public async updateStaff(req: Request, res: Response): Promise<void> {
        try {
            await StaffService.updateStaff(req); // Call the service to update a staff member
            res.status(200).json(handleResponse(null, StaffMessages.UpdateSuccessfull, ResponseCodes.OK)); // Success response with updated staff data
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    res.status(404).json(handleResponse(null, StaffMessages.StaffNotFound, ResponseCodes.NOT_FOUND)); // Handle not found error
                } else if (error.message === StaffMessages.StaffAlreadyExists) {
                    res.status(400).json(handleResponse(null, StaffMessages.StaffAlreadyExists, ResponseCodes.BAD_REQUEST)); // Handle existing staff error
                } else {
                    res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Generic error
                }
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Unknown error
            }
        }
    }

    /**
     * Fetches a staff member by ID.
     * 
     * @param req - The Express request object containing the staff ID in the request parameters.
     * @param res - The Express response object used to send the response.
     */
    public async fetchStaff(req: Request, res: Response): Promise<void> {
        const { id } = req.params; // Extract staff ID from request parameters
        if (!id) { // Check if ID is not provided
            res.status(404).json(handleResponse(null, StaffMessages.StaffNotFound, ResponseCodes.NOT_FOUND)); // Handle not found error
            return; // Exit early
        }
        try {
            const staff = await StaffService.fetchStaffById(req); // Call the service to fetch a staff member by ID
            if (!staff) { // Check if staff is not found in the database
                res.status(404).json(handleResponse(null, StaffMessages.StaffNotFound, ResponseCodes.NOT_FOUND)); // Handle not found error
                return; // Exit early
            }
            res.status(200).json(handleResponse(staff, StaffMessages.FetchSuccessful, ResponseCodes.OK)); // Success response
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    res.status(404).json(handleResponse(null, StaffMessages.StaffNotFound, ResponseCodes.NOT_FOUND)); // Handle not found error
                } else {
                    res.status(500).json(handleResponse(null, error.message || ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Generic error
                }
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Unknown error
            }
        }
    }


    /**
     * 
     * Retrieves a list of staff members.
     * 
     * @param req - The Express request object containing query parameters for fetching staff.
     * @param res - The Express response object used to send the response.
     */
    public async getStaffList(req: Request, res: Response): Promise<void> {
        try {
            const result = await StaffService.fetchStaff(req); // Call the service to fetch staff members
            
            const formattedResult = result.staff.map((staff: any) => {
                const formattedStaff: any = {
                    id: staff.staff_uuid,
                    name: `${staff.first_name} ${staff.last_name}`, // Provider name
                    profilePic: staff?.profile_pic, // Provider/staff profile pic thumbnail
                    status: staff?.staff_status,
                    isDeleted:staff?.is_deleted,
                    bio: staff.staff_bio?.split('\n').slice(0, 3).join('\n') || null, // First 3 lines of bio
                    mobileNumber: staff.mobile_number,
                    countryCode: staff.country_code,
                    commissionPercentage: parseFloat(staff.staff_commission)
                        
                };

                if (staff.provider_specializations?.specialization_services?.length) {
                    formattedStaff.specialty = staff.provider_specializations.specialization_services; // Specialty names
                }

                return formattedStaff;
            });

            const response = {
                data: formattedResult,
                totalPages: result.totalPages, // Assuming result contains totalCount
                currentPage: result.currentPage,
                totalRecords: result.totalRecords
            };

            res.status(200).json(handleResponse(response, StaffMessages.FetchSuccessful, ResponseCodes.OK)); // Success response
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Generic error
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Unknown error
            }
        }
    }

    /**
     * Updates the status or soft deletes a staff member.
     * @param req - The Express request object containing staff ID and new status or delete flag.
     * @param res - The Express response object used to send the response.
     */
    public async updateOrDeleteStaff(req: Request, res: Response): Promise<void> {
        try {
            const { status, isDeleted } = req.body; // Extract status and isDeleted from request body
            const result = await StaffService.updateOrDeleteStaff(req); // Call service to update or delete staff

            if (status !== undefined) {
                // If status is updated
                res.status(200).json(handleResponse(null, `${result.first_name} ${StaffMessages.StatusChangedSuccessfull}`, ResponseCodes.OK)); // Success response for status change
            } else if (isDeleted !== undefined) {
                // If staff is deleted
                res.status(200).json(handleResponse(null, `${result.first_name} ${StaffMessages.DeleteSuccessfull}`, ResponseCodes.OK)); // Success response for deletion
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    res.status(404).json(handleResponse(null, StaffMessages.StaffNotFound, ResponseCodes.NOT_FOUND)); // Handle not found error
                } else {
                    res.status(500).json(handleResponse(null, ErrorMessages.InternalServerError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Generic error
                }
            } else {
                res.status(500).json(handleResponse(null, ErrorMessages.UnknownError, ResponseCodes.INTERNAL_SERVER_ERROR)); // Unknown error
            }
        }
    }
}

export default new StaffController();