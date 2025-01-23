import { Knex } from 'knex';

/**
 * Inserts a new staff record into the tenant_staff table.
 *
 * @param knex - The Knex instance to run the migration.
 * @param staffData - The staff details provided by the user.
 */
export async function insertTenantStaff(knex: Knex, staffData: {
  staff_experience: any;
  mobile_number: any;
  country_code: any;
  staff_uuid: string;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: number;
  password: string;
  date_of_joining: string; // Format: 'YYYY-MM-DD'
  address_line1: string;
  address_line2?: string;
  city: number;
  state: number;
  country: number;
  pincode: string;
  profile_pic: string;
}) {
  try {
    // Insert the new staff record into the tenant_staff table
    await knex('tenant_staff').insert({
      staff_uuid: staffData.staff_uuid,
      first_name: staffData.first_name,
      last_name: staffData.last_name,
      email_id: staffData.email_id,
      mobile_number:staffData.mobile_number,
      phone_number: staffData.phone_number || null,
      password: staffData.password,
      country_code:staffData.country_code,
      staff_brief: '', // Default empty string
      date_of_joining: staffData.date_of_joining,
      staff_gender: 'm', // Default to 'm'
      staff_experience:staffData.staff_experience || 0,
      address_line1: staffData.address_line1,
      address_line2: staffData.address_line2 || '', // Optional
      city: staffData.city,
      state: staffData.state,
      country: staffData.country,
      pincode: staffData.pincode,
      profile_pic: staffData.profile_pic,
      staff_type: 'super', // Default to 'super'
      staff_status: 1, // Default to active
      tenant_address_id:1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });

    console.log('New staff record inserted successfully');
  } catch (error) {
    console.error('Error inserting staff record:', error);
    throw error;
  }
}
