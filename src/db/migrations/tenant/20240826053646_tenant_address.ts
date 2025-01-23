import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_address', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.string('contact_first_name', 40).notNullable(); // Contact person name
    table.string('contact_last_name',30).notNullable();
    table.string('email_id', 50).notNullable(); // Email address
    table.smallint('country_code').notNullable()
    table.string('phone_number', 20).notNullable(); // Phone number
    table.string('alternate_phone_number', 20); // Optional alternate phone number
    table.string('address_line1', 100); // Address line 1
    table.string('address_line2', 50); // Address line 2
    table.integer('city').index(); // City
    table.integer('state').index(); // State
    table.integer('country').index(); // Country
    table.string('zipcode').index(); // Zip code
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_address'); // Drop the table if it exists
}
