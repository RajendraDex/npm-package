import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_master', (table) => {
    table.increments('id').primary().notNullable(); // Primary key column
    table.string('tenant_uuid', 64).notNullable(); // UUID of the tenant
    table.string('tenant_name', 60).notNullable().unique().index(); // Name of the tenant
    table.string('contact_first_name', 40).notNullable(); // Contact person's name
    table.string('contact_last_name', 40).notNullable(); // Contact person's name
    table.string('email_id', 100); // Email ID
    table.smallint('country_code').notNullable();
    table.string('phone_number',15).notNullable().index(); // Phone number
    table.string('registration_number', 30); // Registration number
    table.string('tenant_subdomain',100).unique().notNullable().index();
    table.string('alternate_phone_number', 20); // Alternate phone number
    table.tinyint('tenant_status').defaultTo(1).notNullable().index(); // Tenant status (0 => inactive, 1 => active, 2 => void)
    table.string('db_name', 100); // Database name
    table.string('db_host', 60); // Database host
    table.string('db_username', 100); // Database username
    table.string('db_password', 100); // Database password
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Timestamp for when the tenant was created
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Timestamp for when the tenant was last updated
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('tenant_master');
}
