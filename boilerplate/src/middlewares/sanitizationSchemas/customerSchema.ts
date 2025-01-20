import { z } from 'zod';
import { CustomerErrors } from '../../enums/errorMessages';

// Define the Zod schema for customer data validation
export const createCustomerSchema = z.object({
  // The customer's first name, which is required and must be at least 3 characters long
  firstName: z.string().min(3, { message: CustomerErrors.FirstNameRequired }),

  // The customer's last name, which is optional and can be null
  lastName: z.string().nullable().optional(),

  // The customer's email address, which is optional and can be null
  emailId: z.string().nullable().optional(),

  // The customer's country code, which must be a string with length between 1 and 8
  countryCode: z.string().min(1, { message: CustomerErrors.CountryCodeRequired }).max(8, { message: CustomerErrors.CountryCodeLength }),

  // The customer's phone number, which is required and must be at least 10 characters long
  phoneNumber: z.string().min(10, { message: CustomerErrors.PhoneNumberRequired }),

  // The customer's password, which is required and must be at least 1 character long
  password: z.string().min(1, { message: CustomerErrors.PasswordRequired }),

  // The customer's gender, which is optional and must be one of the specified values ('m', 'f', 'o')
  gender: z.enum(['m', 'f', 'o'], { message: CustomerErrors.InvalidGender }).optional(),

  // The URL of the customer's profile picture, which is optional and can be null
  profilePic: z.string().nullable().optional(),

  // Optional additional information, which can be any structure
  additionalInfo: z.record(z.unknown()).optional(),

  // The customer's date of birth, which is optional and can be null
  dob: z.string().nullable().optional(),
 // additionalInfo: z.record(z.unknown()).optional(),
  // The customer's date of birth, which is optional and can be null
  promotionId: z.string().nullable().optional(),  
  purchaseDate: z.string().nullable().optional(),
});

// Define the Zod schema for customer update validation
export const updateCustomerSchema = z.object({
  // The customer's first name, which is optional and must be at least 1 character long if provided
  firstName: z.string().min(1, { message: CustomerErrors.FirstNameRequired }).optional(),

  // The customer's last name, which is optional and can be null
  lastName: z.string().nullable().optional(),

  // The customer's email address, which is optional and can be null
  emailId: z.string().nullable().optional(),

  // The customer's country code, which is optional and must be a string with length between 1 and 8 if provided
  countryCode: z.string().min(1, { message: CustomerErrors.CountryCodeRequired }).max(8, { message: CustomerErrors.CountryCodeLength }).optional(),

  // The customer's phone number, which is optional and must be at least 1 character long if provided
  phoneNumber: z.string().min(1, { message: CustomerErrors.PhoneNumberRequired }).optional(),

  // The customer's gender, which is optional and must be one of the specified values ('m', 'f', 'o') if provided
  gender: z.enum(['m', 'f', 'o'], { message: CustomerErrors.InvalidGender }).optional(),

  // The URL of the customer's profile picture, which is optional and can be null
  profilePic: z.string().nullable().optional(),

  // The customer's date of birth, which is optional and can be null
  dob: z.string().nullable().optional(),

  // Optional additional information, which can be any structure
  // additionalInfo: z.record(z.unknown()).optional(),
  promotionId: z.string().nullable().optional(),
  purchaseDate: z.string().nullable().optional(),
});

// Define the Zod schema for customer deletion validation
export const deleteCustomerSchema = z.object({
  // The customer's ID, which is required and must be at least 1 character long
  customerId: z.string().min(1, { message: CustomerErrors.CustomerIdRequired }),

  // The deletion flag, which must be either 0 or 1
  isDeleted: z.union([z.literal(0), z.literal(1)], { message: CustomerErrors.DeleteFlag })
});

// Define the Zod schema for changing customer status validation
export const changeStatusSchema = z.object({
  // The customer's ID, which is required and must be at least 1 character long
  customerId: z.string().min(1, { message: CustomerErrors.CustomerIdRequired }),

  // The status flag, which must be one of the specified values (0, 1, 2)
  status: z.union([z.literal(0), z.literal(1), z.literal(2)], { message: CustomerErrors.StatusFlag })
});

export const deleteCustomerOfferLinkSchema = z.object({
  promotionId: z.string().min(1, { message: CustomerErrors.PromotionIdRequired }),
  customerId: z.string().min(1, { message: CustomerErrors.CustomerIdRequired }),
});
