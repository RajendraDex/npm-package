import { z } from 'zod';
import { AddressErrors, TenantErrors } from '../../enums/errorMessages';

// Define the schema for address validation
export const addressSchema = z.object({
    // Validate contact first name: required, max length 40
    contactFirstName: z.string().min(1, AddressErrors.FieldRequired).max(40, AddressErrors.MaxLength.replace('field', 'contact first name').replace('maxLength', '40')),
    // Validate contact last name: required, max length 30
    contactLastName: z.string().min(1, AddressErrors.FieldRequired).max(30, AddressErrors.MaxLength.replace('field', 'contact last name').replace('maxLength', '30')),
    // Validate contact email ID: must be a valid email, required, max length 50
    contactEmailId: z.string().email().min(1, AddressErrors.FieldRequired).max(50, AddressErrors.MaxLength.replace('field', 'contact email id').replace('maxLength', '50')),
    // Validate contact phone number: required, max length 12
    contactPhoneNumber: z.string().regex(/^\d+$/, { message: AddressErrors.InvalidPhoneNumber }).min(1, AddressErrors.FieldRequired).max(12, AddressErrors.MaxLength.replace('field', 'contact phone number').replace('maxLength', '12')),
    // Validate alternate phone number: optional, max length 12
    contactAlternatePhoneNumber: z.string().max(12).optional().nullable(),
    // Validate alternate phone number country code: optional, max length 8
    contactAlternatePhoneNumberCountryCode: z.string().max(8).optional().nullable(),
    // Validate country code: required, max value 8
    contactPhoneNumberCountryCode: z.string().min(1, AddressErrors.FieldRequired).max(8, AddressErrors.MaxLength.replace('field', 'contact phone number country code').replace('maxLength', '8')),
    // Validate address line 1: required, max length 100
    addressLine1: z.string().min(1, AddressErrors.FieldRequired).max(100, AddressErrors.MaxLength.replace('field', 'address line 1').replace('maxLength', '100')),
    // Validate address line 2: optional, max length 50
    addressLine2: z.string().max(50, AddressErrors.MaxLength.replace('field', 'address line 2').replace('maxLength', '50')).optional().nullable(),
    // Validate city: required, must be a number
    city: z.number().min(1, AddressErrors.FieldRequired),
    // Validate state: required, must be a number
    state: z.number().min(1, AddressErrors.FieldRequired),
    // Validate country: required, must be a number
    country: z.number().min(1, AddressErrors.FieldRequired),
    // Validate zipcode: required, max length 6
    zipcode: z.string().regex(/^\d+$/, { message: AddressErrors.InvalidZipcode }).min(1, AddressErrors.FieldRequired).max(6, AddressErrors.MaxLength.replace('field', 'zipcode').replace('maxLength', '6')),
    // Validate location phone number: optional, max length 12
    locationPhoneNumber: z.string().max(12).optional().nullable(),
    // Validate location country code: optional, max length 8
    locationCountryCode: z.string().max(8).optional().nullable(),
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

// Define the schema for updating address validation
export const updateAddressSchema = z.object({
    // Validate contact first name: optional, max length 40
    contactFirstName: z.string().min(1, AddressErrors.FieldRequired).max(40, AddressErrors.MaxLength.replace('field', 'contact first name').replace('maxLength', '40')).optional(),
    // Validate contact last name: optional, max length 30
    contactLastName: z.string().min(1, AddressErrors.FieldRequired).max(30, AddressErrors.MaxLength.replace('field', 'contact last name').replace('maxLength', '30')).optional(),
    // Validate contact email ID: must be a valid email, optional, max length 50
    contactEmailId: z.string().email().min(1, AddressErrors.FieldRequired).max(50, AddressErrors.MaxLength.replace('field', 'contact email id').replace('maxLength', '50')).optional(),
    // Validate contact phone number: optional, max length 12
    contactPhoneNumber: z.string().regex(/^\d+$/, { message: AddressErrors.InvalidPhoneNumber }).min(1, AddressErrors.FieldRequired).max(12, AddressErrors.MaxLength.replace('field', 'contact phone number').replace('maxLength', '12')).optional(),
    // Validate alternate phone number: optional, max length 12
    contactAlternatePhoneNumber: z.string().max(12).optional().nullable(),
    // Validate country code: optional, max value 8
    contactPhoneNumberCountryCode: z.string().min(1, AddressErrors.FieldRequired).max(8, AddressErrors.MaxLength.replace('field', 'contact phone number country code').replace('maxLength', '8')).optional(),
    // Validate address line 1: optional, max length 100
    addressLine1: z.string().min(1, AddressErrors.FieldRequired).max(100, AddressErrors.MaxLength.replace('field', 'address line 1').replace('maxLength', '100')).optional(),
    // Validate address line 2: optional, max length 50
    addressLine2: z.string().max(50, AddressErrors.MaxLength.replace('field', 'address line 2').replace('maxLength', '50')).optional().nullable(),
    // Validate city: optional, must be a number
    city: z.number().min(1, AddressErrors.FieldRequired),
    // Validate state: optional, must be a number
    state: z.number().min(1, AddressErrors.FieldRequired),
    // Validate country: optional, must be a number
    country: z.number().min(1, AddressErrors.FieldRequired),
    // Validate zipcode: optional, max length 6
    zipcode: z.string().regex(/^\d+$/, { message: AddressErrors.InvalidZipcode }).min(1, AddressErrors.FieldRequired).max(6, AddressErrors.MaxLength.replace('field', 'zipcode').replace('maxLength', '6')).optional(),
    // Validate location phone number: optional, max length 12
    locationPhoneNumber: z.string().max(12).optional().nullable(),
    // Validate location country code: optional, max length 8
    locationCountryCode: z.string().max(8).optional().nullable(),
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

export const changeStatusSchema = z.object({
    status: z.enum(["active", "inactive", "Active", "Inactive"], { message: AddressErrors.InvalidStatus })
});
