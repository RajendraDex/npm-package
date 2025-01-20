import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the tenant_staff table
  await knex.schema.createTable('tenant_staff', (table) => {
    table.increments('id').primary().notNullable(); // Primary key
    table.string('staff_uuid', 64).notNullable(); // Unique identifier for staff
    table.string('first_name', 60).notNullable().index(); // First name with index
    table.string('last_name', 60).notNullable().index(); // Last name with index
    table.string('email_id', 100).notNullable().index(); // Email ID with index
    table.string('mobile_number',12).notNullable().index()
    table.string('country_code',8).notNullable();
    table.string('phone_number',12).nullable().index(); // Phone number with index
    table.integer('staff_experience').notNullable();
    table.string('password', 150); // Password (optional)
    table.integer('tenant_address_id').unsigned().references('id').inTable('tenant_address'); // Foreign key reference to tenant_address
    table.text('staff_brief'); // Staff brief (optional)
    table.date('date_of_joining').notNullable(); // Date of joining
    table.enu('staff_gender', ['m', 'f', 'o']).notNullable(); // Gender: 'm', 'f', 'o'
    table.string('address_line1', 100).notNullable();
    table.string('address_line2', 50);
    table.integer('city').notNullable().index(); // City with index
    table.integer('state').notNullable().index(); // State with index
    table.integer('country').notNullable().index(); // Country with index
    table.string('pincode', 10).notNullable().index(); // Pincode with index
    table.string('profile_pic', 255).notNullable(); // Profile picture URL
    table.enu('staff_type', ['super', 'staff', 'provider']).notNullable(); // Staff type: 'super', 'staff', 'provider'
    table.tinyint('staff_status').notNullable().defaultTo(1); // Staff status: 0 => inactive, 1 => active, 2 => void
    table.tinyint('is_deleted').notNullable().defaultTo(0);
    table.text('staff_bio ').nullable();
    table.string('created_by')
    table.json('provider_specializations');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp with auto-update
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_staff');
}
