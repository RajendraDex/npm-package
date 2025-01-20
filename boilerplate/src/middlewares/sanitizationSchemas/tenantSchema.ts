import { z } from 'zod';
import { TenantErrors } from '../../enums/errorMessages';

export const updateStatusSchema = z.object({
  // Updated to match the structure of deleteCustomerSchema
  status: z.union([z.literal(0), z.literal(1)], { message: TenantErrors.StatusZeroOrOne })
})

// Define the Zod schema for tenant data validation
export const createTenantSchema = z.object({
  // The name of the company, which is required and must be a non-empty string
  companyName: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The company's registration number, which is optional
  registrationNumber: z.string().optional(),

  // The email address of the company, which must be a valid email format
  emailId: z.string().email({ message: TenantErrors.InvalidEmail}),

  // The phone number of the company, which is required and must be a non-empty string
  phoneNumber: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The username for the tenant, which is required and must be a non-empty string
  username: z.string().min(1, { message: TenantErrors.FieldRequired }).nullable().optional(),

  // The password for the tenant, which is required and must be a non-empty string
  password: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The domain name of the tenant, which is required and must be a non-empty string
  domainName: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The first line of the address, which is required and must be a non-empty string
  addressLine1: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The second line of the address, which is optional
  addressLine2: z.string().optional(),

  // The ID of the city, which must be a positive integer
  city: z.number().int().positive({ message: TenantErrors.FieldRequired }),

  // The ID of the state, which must be a positive integer
  state: z.number().int().positive({ message: TenantErrors.FieldRequired }),

  // The country code, which must be a positive integer
  countryCode: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The ID of the country, which must be a positive integer
  country: z.number().int().positive({ message: TenantErrors.FieldRequired }),

  // The zipcode, which is required and must be a non-empty string
  zipcode: z.string().min(1, { message: TenantErrors.FieldRequired}),

  // The first name of the contact person, which is required and must be a non-empty string
  contactFirstName: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The last name of the contact person, which is required and must be a non-empty string
  contactLastName: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // The contact person's email address, which must be a valid email format
  contactEmailId: z.string().email({ message: TenantErrors.FieldRequired }),

  // The contact person's phone number, which is required and must be a non-empty string
  contactPhoneNumber: z.string().min(1, { message: TenantErrors.FieldRequired }),

  // An alternate phone number for the contact person, which is optional
  contactAlternatePhoneNumber: z.string().optional(),

  contactPhoneNumberCountryCode: z.string().min(1, { message: TenantErrors.FieldRequired }),
  contactAlternatePhoneNumberCountryCode:z.string().optional(),
  profilePic: z.string().optional().nullable(),

  // Optional array of objects specifying operation hours
  operationHours: z.array(z.object({
    // The day of the week when the operation hours apply, which must be one of the specified days
    dayOfWeek: z.enum(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], { message: TenantErrors.InvalidDayofWeek }),

    // The start time of operations on the specified day, which must match the HH:MM:SS format
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: TenantErrors.InvalidDayofWeek }),

    // The end time of operations on the specified day, which must match the HH:MM:SS format
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: TenantErrors.InvalidEndTime })
  })).optional(),
});

// Define the Zod schema for updating tenant data
export const updateTenantSchema = z.object({
  companyName: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  registrationNumber: z.string().optional(),
  emailId: z.string().email({ message: TenantErrors.InvalidEmail}).optional(),
  phoneNumber: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  username: z.string().nullable().optional(),
  password: z.string().optional().nullable(),
  domainName: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  addressLine1: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  addressLine2: z.string().optional(),
  city: z.number().int().positive({ message: TenantErrors.FieldRequired }).optional(),
  state: z.number().int().positive({ message: TenantErrors.FieldRequired }).optional(),
  countryCode: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  country: z.number().int().positive({ message: TenantErrors.FieldRequired }).optional(),
  zipcode: z.string().min(1, { message: TenantErrors.FieldRequired}).optional(),
  contactFirstName: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  contactLastName: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  contactEmailId: z.string().email({ message: TenantErrors.FieldRequired }).optional(),
  contactPhoneNumber: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  contactAlternatePhoneNumber: z.string().optional(),
  contactPhoneNumberCountryCode: z.string().min(1, { message: TenantErrors.FieldRequired }).optional(),
  contactAlternatePhoneNumberCountryCode: z.string().optional(),
  profilePic: z.string().optional().nullable(),
  operationHours: z.array(z.object({
    dayOfWeek: z.enum(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], { message: TenantErrors.InvalidDayofWeek }).optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: TenantErrors.InvalidDayofWeek }).optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, { message: TenantErrors.InvalidEndTime }).optional()
  })).optional(),
}).strict();
