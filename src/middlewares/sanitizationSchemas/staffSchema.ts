import { z } from 'zod';
import { CategoryErrors, StaffErrors } from '../../enums/errorMessages'; // Import the error messages
import { isValidDate } from '../../helpers/tenants/regEx';

const staffSchema = z.object({
    firstName: z.string().min(1, { message: StaffErrors.FirstNameRequired }),
    domain:z.string().optional().nullable(),
    lastName: z.string().min(1, { message: StaffErrors.LastNameRequired }),
    emailId: z.string().email({ message: StaffErrors.EmailInvalid }),
    phoneNumber:z.string().nullable().optional(),
    password: z.string().optional().nullable(),
    staffBrief: z.string().min(1, { message: StaffErrors.FirstNameRequired }).optional(),
    dateOfJoining: z.string().refine(date => {
        return isValidDate(date) && !isNaN(Date.parse(date));
    }, {
        message: StaffErrors.DateInvalid,
    }),
    gender: z.enum(['m', 'f','o'], { message: StaffErrors.GenderRequired }),
    addressLine1: z.string().min(1, { message: StaffErrors.AddressLine1Required }),
    addressLine2: z.string().optional(),
    city: z.number().min(1, { message: StaffErrors.CityRequired }),
    state: z.number().min(1, { message: StaffErrors.StateRequired }),
    country: z.number().min(1, { message: StaffErrors.CountryRequired }),
    pincode: z.string().min(1, { message: StaffErrors.PincodeRequired }),
    profilePic: z.string().nullable().optional(),
    staffType: z.enum(['provider', 'staff']), // Adjust as necessary
    createdBy: z.string().min(1).optional(),
    countryCode: z.string().min(1), // New field
    pCountryCode:z.string().nullable().optional(),
    mobileNumber:  z.string().min(1, { message: StaffErrors.PhoneNumberRequired }).length(10, { message: StaffErrors.PhoneNumberInvalid }),
    staffExperience: z.number().optional().nullable(), // New field
    staffBio: z.string().optional(), // New field
    tenantAddressId: z.number().optional(), // New field
    providerSpecializations: z.array(z.string()).optional(),
    Roles: z.array(z.number()).nonempty({ message: StaffErrors.RoleRequired }), 
    commissionPercentage:z.number().optional().nullable(),
    dateOfExit: z.string().optional().nullable().refine(date => {
        if (date !== null && date !== undefined) {
            return isValidDate(date) && !isNaN(Date.parse(date));
        }
        return true;
    }, {
        message: StaffErrors.DateInvalid,
    })

});
const updateStaffSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    emailId: z.string().email().optional(),
    phoneNumber: z.string().nullable().optional(), 
    password: z.string().min(8).optional(), // Added for update
    dateOfJoining: z.string().refine(date => {
        return isValidDate(date) && !isNaN(Date.parse(date));
    }, {
        message: StaffErrors.DateFormatInvalid,
    }).optional(),
    gender: z.enum(['m', 'f', 'o']).optional(),
    addressLine1: z.string().min(1).optional(),
    addressLine2: z.string().optional(),
    city: z.number().min(1).optional(),
    state: z.number().min(1).optional(),
    country: z.number().min(1).optional(),
    pincode: z.string().min(1).optional(),
    profilePic: z.string().optional().nullable(),
    staffType: z.enum(['provider', 'staff']).optional(), // Adjust as necessary
    staffStatus:z.union([z.literal(0), z.literal(1)], { message: CategoryErrors.StatusZeroOrOne }).optional(),
    countryCode: z.string().min(1).optional(), // Added for update
    pCountryCode:z.string().nullable().optional(),
    mobileNumber: z.string().length(10).optional(), // Added for update
    staffExperience: z.number().optional(), // Added for update
    staffBio: z.string().optional(), // Added for update
    tenantAddressId: z.number().optional(), // Added for update
    providerSpecializations: z.array(z.string()).optional(),
    Roles: z.array(z.number()).optional(), // New field
    commissionPercentage:z.number().optional().nullable(),
    dateOfExit: z.string().optional().nullable().refine(date => {
        if (date !== null && date !== undefined) {
            return isValidDate(date) && !isNaN(Date.parse(date));
        }
        return true;
    }, {
        message: StaffErrors.DateInvalid,
    })
});

const staffIdSchema = z.object({
    id: z.string().uuid(), // Assuming staff ID is a UUID, adjust if necessary
});

const staffStatusSchema = z.object({
    status: z.union([z.literal(0), z.literal(1)], { message: CategoryErrors.StatusZeroOrOne }) // Use imported error message
})

const staffDeleteSchema = z.object({
    isDeleted: z.union([z.literal(0), z.literal(1)], { message: CategoryErrors.StatusZeroOrOne }) // Use imported error message
})

export { staffSchema, updateStaffSchema,staffIdSchema,staffStatusSchema ,staffDeleteSchema};