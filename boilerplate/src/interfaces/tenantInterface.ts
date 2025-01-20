// Interface representing tenant details
export interface ITenant {
  // Optional unique identifier for the tenant, typically used as a primary key
  id?: number;

  // Required UUID for the tenant, ensuring global uniqueness
  tenant_uuid: string;

  // Required name of the tenant
  tenant_name: string;

  // Required contact person's first name for the tenant
  contact_first_name: string;

  // Required contact person's last name for the tenant
  contact_last_name: string;

  // Optional email address for the tenant
  email_id?: string;

  // Required country code, representing the tenant's country
  country_code: number;

  // Optional password for the tenant, used for authentication
  password?: string;

  // Required phone number for the tenant
  phone_number: string;

  // Optional registration number for the tenant
  registration_number?: string;

  // Required subdomain for the tenant, used for identifying tenant-specific URLs
  tenant_subdomain: string;

  // Optional alternate phone number for the tenant
  alternate_phone_number?: string;

  // Required status of the tenant, often represented as an integer
  tenant_status: number;

  // Optional database name specific to the tenant
  db_name?: string;

  // Optional database host for the tenant
  db_host?: string;

  // Optional database username for accessing the tenant's database
  db_username?: string;

  // Optional database password for accessing the tenant's database
  db_password?: string;

  // Optional timestamp representing when the tenant was created
  created_at?: Date;

  // Optional timestamp representing when the tenant was last updated
  updated_at?: Date;
  profile_pic?: string;
  tenant_username?: string;
}

// Interface representing address details
export interface IAddress {
  // Optional unique identifier for the address, typically used as a primary key
  id?: number;

  // Required contact person's first name for the address
  contact_first_name: string;

  // Required contact person's last name for the address
  contact_last_name: string;

  // Required email address associated with the address
  email_id: string;

  // Required country code for the address, representing the country
  country_code: number;

  // Required phone number for the address
  phone_number: string;

  // Optional alternate phone number for the address
  alternate_phone_number: string;

  // Required address line 1
  address_line1: string;

  // Optional address line 2
  address_line2?: string;

  // Required city ID for the address, referencing a city entity
  city: number;

  // Required state ID for the address, referencing a state entity
  state: number;

  // Required country ID for the address, referencing a country entity
  country: number;

  // Required postal code for the address
  zipcode: string;
  alternate_phone_country_code:string;
  address_type?:number;
}

// Interface representing operation hours for a tenant
export interface IOperationHour {
  // Unique identifier for the operation hour record
  id: any;

  // Required tenant address ID, linking to the address record
  tenant_address_id?: number;

  // Required day of the week for the operation hour, represented as an abbreviation
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

  // Required start time of the operation, formatted as HH:MM:SS
  start_time: string;

  // Required end time of the operation, formatted as HH:MM:SS
  end_time: string;
}

// Interface representing tenant staff details
export interface ITenantStaff {
  // Optional unique identifier for the staff member, typically used as a primary key
  id?: number;

  // Required UUID for the staff member, ensuring global uniqueness
  staff_uuid: string;

  // Required first name of the staff member
  first_name: string;

  // Required last name of the staff member
  last_name: string;

  // Required email address of the staff member
  email_id: string;

  // Required phone number of the staff member
  phone_number: number;

  // Optional password for the staff member, used for authentication
  password?: string;

  // Optional brief description about the staff member
  staff_brief?: string;

  // Required date when the staff member joined the organization
  date_of_joining: Date;

  // Required gender of the staff member, represented as 'm' (male), 'f' (female), or 'o' (other)
  staff_gender: 'm' | 'f' | 'o';

  // Required address line 1 of the staff member's address
  address_line1: string;

  // Optional address line 2 of the staff member's address
  address_line2?: string;

  // Required city ID of the staff member's address, referencing a city entity
  city: number;

  // Required state ID of the staff member's address, referencing a state entity
  state: number;

  // Required country ID of the staff member's address, referencing a country entity
  country: number;

  // Required postal code of the staff member's address
  pincode: string;

  // Required URL or path to the staff member's profile picture
  profile_pic: string;

  // Required type of staff member, representing their role (e.g., 'super', 'staff', 'provider')
  staff_type: 'super' | 'staff' | 'provider';

  // Optional status of the staff member, indicating if they are active or inactive
  staff_status?: boolean;

  // Optional ID of the staff member who created this record
  created_by?: number;

  // Optional timestamp representing when the staff member was created
  created_at?: Date;

  // Optional timestamp representing when the staff member was last updated
  updated_at?: Date;
  is_deleted?: boolean;
  staff_experience?:number;
  provider_specializations?:any;
  staff_commission?:string;
}

// Interface representing tenant customer details
export interface ITenantCustomer {
  // Optional unique identifier for the customer, typically used as a primary key
  id?: number;

  // Required UUID for the customer, ensuring global uniqueness
  customer_uuid: string;

  // Required first name of the customer
  first_name: string;

  // Required last name of the customer
  last_name: string;

  // Required email address of the customer
  email_id: string;

  // Required country code for the customer, representing the country
  country_code: number;

  // Required phone number of the customer
  phone_number: string;

  // Optional password for the customer, used for authentication
  password?: string;

  // Optional additional information about the customer, stored as a JSON object
  additional_info?: Record<string, any>;

  // Required timestamp representing when the customer was created
  created_at: Date;

  // Required timestamp representing when the customer was last updated
  updated_at: Date;
}

// Interface representing tenant customer details (same as ITenantCustomer but with non-optional fields)
export interface TenantCustomer {
  customer_status: number;
  is_deleted: boolean;
  profile_pic?: string;

  customer_gender?: string;
  // Required unique identifier for the customer, typically used as a primary key
  id: number;

  // Required UUID for the customer, ensuring global uniqueness
  customer_uuid: string;

  // Required first name of the customer
  first_name: string;

  // Required last name of the customer
  last_name: string;

  // Required email address of the customer
  email_id: string;

  // Required country code for the customer, representing the country
  country_code: number;

  // Required phone number of the customer
  phone_number: string;

  // Optional password for the customer, used for authentication
  password?: string;

  // Optional additional information about the customer, stored as a JSON object
  additional_info?: Record<string, any>;

  // Required timestamp representing when the customer was created
  created_at: Date;

  // Required timestamp representing when the customer was last updated
  updated_at: Date;
  customer_dob?: string;
}
