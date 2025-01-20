import { Request } from 'express';
import TenantStaffRepository from '../../repository/tenant/staffRepository'; // Import the staff repository
import { ErrorMessages, StaffMessages } from '../../enums/responseMessages'; // Import enums for messages
import { ITenantStaff } from '../../interfaces/tenantInterface'; // Import the tenant staff interface
import Auth from '../../helpers/auth/authHelper';
import { convertToCamelCase, formatString,formatDuration } from '../../helpers/tenants/formatters';
import Model from '../../models/generelisedModel';
import { defaultKnex } from '../../db/knexfile';
class StaffService extends Auth {
    /**
     * Creates a new staff member using the provided staff data.
     * 
     * @param req - The Express request object containing staff data in the body.
     * @returns A promise that resolves to the newly created staff member.
     * @throws Error if the staff member already exists or if an internal server error occurs.
     */
    public async createStaff(req: Request): Promise<ITenantStaff> {
        const db = (req as any).knex; // Retrieve Knex instance from the request
        const token = req.headers.authorization?.split(' ')[1];
        let staffData = req.body;
        const specializations = staffData.providerSpecializations ? {
            object_id: this.generateUUID(),
            staff_id: staffData.providerSpecializations.staffId,
            specialization_services: staffData.providerSpecializations
        } : undefined; // Only set if providerSpecializations exists
        // Verify the provided token and retrieve user details
        const decodedToken = this.verifyToken(token!); // Verify token
        const user = decodedToken.id; // Assuming the user ID is stored in the token
        const model = new Model(db);
        const createdBy = await model.select('tenant_staff', { staff_uuid: user }, ['id'])
        const formatedStaffData = {
            staff_uuid: this.generateUUID(),
            first_name: formatString(staffData.firstName),
            last_name: formatString(staffData.lastName!),
            email_id: staffData.emailId,
            country_code: staffData.countryCode,
            phone_country_code:staffData.pCountryCode || null,
            mobile_number: staffData.mobileNumber,
            phone_number: staffData.phoneNumber,
            password: staffData.password ||null,
            tenant_address_id: staffData.tenantAddressId,
            staff_commission: staffData.commissionPercentage,
            staff_brief: staffData.staffBrief,
            date_of_joining: staffData.dateOfJoining,
            staff_experience: staffData.staffExperience || 0,
            staff_gender: staffData.gender,
            address_line1: staffData.addressLine1,
            address_line2: staffData.addressLine2,
            city: staffData.city,
            state: staffData.state,
            country: staffData.country,
            staff_bio: staffData.staffBio,
            pincode: staffData.pincode,
            profile_pic: staffData.profilePic ||null,
            staff_type: staffData.staffType,
            staff_status: staffData.staffStatus,
            created_by: createdBy[0]?.id || 1,
            provider_specializations: staffData.staffType === 'provider' ? specializations : undefined, // Only save if staffType is 'provider'
            date_of_exit: staffData.dateOfExit || null,
        };

        try {
            // Check if staff already exists by email or phone
            const staffRepo = new TenantStaffRepository(db);
            const existingStaff = await staffRepo.findByEmailOrPhone(staffData.emailId, staffData.phoneNumber);
            if (existingStaff) {
                throw new Error(StaffMessages.StaffAlreadyExists); // Specific error if staff already exists
            }
            if (formatedStaffData.password) {
                formatedStaffData.password = await this.hashPassword(staffData.password); // Use parent's hashPassword method
            }
            const newStaff = await staffRepo.add(formatedStaffData); // Call add method in TenantStaffRepository

            // Assign dummy roles to the newly created staff
            const RoleIds = staffData.Roles; // Example dummy role IDs
            await staffRepo.assignRolesToStaff(newStaff.id, RoleIds); // Assign roles

            return newStaff; // Return the newly created staff member
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffAlreadyExists) {
                    throw new Error(StaffMessages.StaffAlreadyExists); // Specific error if staff already exists
                }
                throw new Error(error.message || ErrorMessages.InternalServerError); // General error for other issues
            }
            throw new Error(ErrorMessages.UnknownError); // Unknown error
        }
    }

    /**
     * Updates staff member details.
     * 
     * @param req - The Express request object containing staff ID and update data.
     * @returns A promise that resolves to the updated staff member.
     * @throws Error if the staff member is not found or if an internal server error occurs.
     */
    public async updateStaff(req: Request) {
        const db = (req as any).knex; // Retrieve Knex instance from the request
        const { id } = req.params; // Extract staff ID from request parameters

        let staffData = req.body;
        const staffRepo = new TenantStaffRepository(db); // Create an instance of TenantStaffRepository

        // Find the current staff member
        const currentStaff = await staffRepo.findByUUID(id);
        if (!currentStaff) {
            throw new Error(StaffMessages.StaffNotFound); // Specific error if staff not found
        }

        // Check if the email is being updated and is different from the current one
        if (staffData.emailId && staffData.emailId !== currentStaff.email_id) {
            const emailExists = await staffRepo.findByEmail(staffData.emailId);
            if (emailExists && emailExists.staff_uuid !== id) {
                throw new Error(StaffMessages.StaffAlreadyExists);
            }
        }

        // Check if the phone number is being updated and is different from the current one
        if (staffData.phoneNumber && staffData.phoneNumber !== currentStaff.phone_number) {
            const phoneExists = await staffRepo.findByPhone(staffData.phoneNumber);
            if (phoneExists && phoneExists.staff_uuid !== id) {
                throw new Error(StaffMessages.StaffAlreadyExists);
            }
        }

        const specializations = staffData.providerSpecializations ? {
            object_id: this.generateUUID(), // Generate UUID for specializations
            staff_id: staffData.providerSpecializations.staffId || undefined,
            specialization_services: staffData.providerSpecializations
        } : undefined; // Only set if providerSpecializations exists

        const formatedStaffData = {
            first_name: formatString(staffData.firstName),
            last_name: formatString(staffData.lastName!),
            email_id: staffData.emailId,
            phone_number: staffData.phoneNumber,
            password: staffData.password,
            tenant_address_id: staffData.tenantAddressId, // Include tenant_address_id
            staff_brief: staffData.staffBrief,
            phone_country_code:staffData.pCountryCode,
            date_of_joining: staffData.dateOfJoining,
            staff_experience: staffData.staffExperience, // Include staff_experience
            staff_commission: staffData.commissionPercentage,
            staff_gender: staffData.gender,
            address_line1: staffData.addressLine1,
            address_line2: staffData.addressLine2,
            city: staffData.city,
            state: staffData.state,
            country: staffData.country,
            staff_bio: staffData.staffBio,
            pincode: staffData.pincode,
            profile_pic: staffData.profilePic ||null,
            staff_type: staffData.staffType,
            staff_status: staffData.staffStatus,
            created_by: staffData.createdBy,
            provider_specializations: staffData.staffType === 'provider' ? specializations : undefined, // Only save if staffType is 'provider'
            date_of_exit: staffData.dateOfExit || null,
        };

        try {
            if (staffData.password) {
                formatedStaffData.password = await this.hashPassword(staffData.password); // Hash password if provided
            }
            const updatedStaff = await staffRepo.update(id, formatedStaffData); // Use restricted data

            // Use the new method to insert or update roles
            const newRoles = staffData.Roles; // New role IDs from request
            await staffRepo.insertOrUpdateRolesForStaff(currentStaff.id!, newRoles); // Assign roles

            return updatedStaff; // Return updated staff
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    throw new Error(StaffMessages.StaffNotFound); // Specific error if staff not found
                }
                throw new Error(error.message || ErrorMessages.InternalServerError); // General error for other issues
            }
            throw new Error(ErrorMessages.UnknownError); // Unknown error
        }
    }

    /**
     * Fetches staff members based on query parameters.
     * 
     * @param req - The Express request object containing query parameters.
     * @returns A promise that resolves to the fetched staff data.
     * @throws Error if an unknown error occurs.
     */


    public async fetchStaff(req: Request): Promise<{ staff: ITenantStaff[], totalPages: number, currentPage: number , totalRecords: number}> {
    const db = (req as any).knex; // Retrieve Knex instance from the request
    const { page = 1, limit = 10, search = '', type = 'staff' , location = 'all' } = req.query; // Extract query parameters with default type 'staff'
    try {
        const staffRepo = new TenantStaffRepository(db); // Create an instance of TenantStaffRepository
        const result = await staffRepo.findAll({
            search: search as string,
            location: location as string
        }, {
            page: Number(page),
            limit: Number(limit)
        }, type as string); // Call findAll method in TenantStaffRepository with correct parameters

        // Fetch service names for each staff member
        const staffWithServices = await Promise.all(result.staff.map(async (staff) => {
            const serviceIds = staff.provider_specializations?.specialization_services || [];
            let services = [];
            if (serviceIds.length) {
                services = await db('tenant_service')
                    .whereIn('service_uuid', serviceIds)
                    .select('id', 'service_name');
            }
           
            return {
                ...staff,
                provider_specializations: {
                    ...staff.provider_specializations,
                    specialization_services: services.map((service: { service_name: any; }) => service.service_name)
                }
            };
        }));
        const totalRecords = Number(result.totalRecords);
        return {
            staff: staffWithServices,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            totalRecords:  totalRecords
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || ErrorMessages.UnknownError);
        }
        throw new Error(ErrorMessages.UnknownError); // Unknown error
    }
}
    /**
     * Fetches a specific staff member by ID.
     * 
     * @param req - The Express request object containing the staff ID in the parameters.
     * @returns A promise that resolves to the staff data.
     * @throws Error if the staff member is not found or if an internal server error occurs.
     */

    public async fetchStaffById(req: Request): Promise<any> {
        const db = (req as any).knex; // Retrieve Knex instance from the request
        const { id } = req.params; // Extract staff ID from request parameters
        try {
            const staffRepo = new TenantStaffRepository(db); // Create an instance of TenantStaffRepository
            const staffData = await staffRepo.findByUUID(id); // Call findById method in TenantStaffRepository
            if (staffData) {
                // Remove password field and convert keys to camelCase
                const { id, staff_uuid, staff_experience, provider_specializations, city, state, country, password, staff_commission, ...staff } = staffData;
                let experience = '';
                if(staff_experience){
                    experience = formatDuration(staff_experience);
                }
                // Fetch service names from tenant_services table
                const serviceIds = provider_specializations?.specialization_services || [];
                const services = await db('tenant_service')
                    .whereIn('service_uuid', serviceIds)
                    .select('service_uuid', 'service_name');

                // Map service IDs to their names
                const specializationServices = services.reduce((acc: any, service: any) => {
                    acc.push({ id: service.service_uuid, service_name: service.service_name });
                    return acc;
                }, []);

                // Fetch city, state, and country names from the default database
                const [cityData, stateData, countryData] = await Promise.all([
                    defaultKnex('city_master').where('id', city).select('id', 'city_name').first(),
                    defaultKnex('state_master').where('id', state).select('id', 'state_name').first(),
                    defaultKnex('country_master').where('id', country).select('id', 'country_name').first()
                ]);

                return convertToCamelCase({
                    id: staff_uuid,
                    ...staff,
                    experience: experience,
                    commissionPercentage: parseFloat(staff_commission!),
                    providerSpecializations: {
                        objectId: provider_specializations?.object_id,
                        specializationServices
                    },
                    city: { id: cityData?.id, name: cityData?.city_name },
                    state: { id: stateData?.id, name: stateData?.state_name },
                    country: { id: countryData?.id, name: countryData?.country_name }
                }); // Convert keys to camelCase
            } else {
                throw new Error(StaffMessages.StaffNotFound);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    throw new Error(StaffMessages.StaffNotFound); // Specific error if staff not found
                }
            }
            throw new Error(ErrorMessages.UnknownError); // Unknown error
        }
    }
    /**
     * Updates the status or soft deletes a staff member.
     * @param req - The Express request object containing staff ID and new status or delete flag.
     * @returns A promise that resolves to the updated staff member or void.
     */
    public async updateOrDeleteStaff(req: Request) {
        const db = (req as any).knex; // Retrieve Knex instance from the request
        const { id } = req.params; // Extract staff ID from request parameters
        const { status, isDeleted } = req.body; // Extract status and isDeleted from request body

        try {
            const fieldsToUpdate: Partial<{ status: number; isDeleted: number }> = {};
            const staffRepo = new TenantStaffRepository(db);
            const existingStaff = await staffRepo.findByUUID(id);
            if (!existingStaff) {
                throw new Error(StaffMessages.StaffNotFound); // Specific error if staff not found
            }

            if (status !== undefined) {
                fieldsToUpdate.status = status; // Add status to fieldsToUpdate if defined
                await staffRepo.update(id, { staff_status: status }); // Update status
                return existingStaff;
            }
            if (isDeleted !== undefined) {
                fieldsToUpdate.isDeleted = isDeleted; // Add isDeleted to fieldsToUpdate if defined
                await staffRepo.update(id, { is_deleted: isDeleted }); // Soft 
                return existingStaff;
            }

            return existingStaff; // Return updated staff member
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === StaffMessages.StaffNotFound) {
                    throw new Error(StaffMessages.StaffNotFound); // Specific error if staff not found
                }
                throw new Error(ErrorMessages.InternalServerError); // Handle other errors
            }
            throw new Error(ErrorMessages.UnknownError); // Unknown error
        }
    }
}

export default new StaffService();