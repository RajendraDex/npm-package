import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the tenant_service table
  await knex.schema.createTable('tenant_service', (table) => {
    table.increments('id').primary().notNullable(); // Primary key
    table.string('service_uuid', 64).notNullable(); // Unique identifier for service
    table.string('service_name', 50).notNullable().unique().index(); // Service name with index
    table.text('service_description'); // Service description (optional)
    table.decimal('service_price'); // Service price
    table.json('service_category_ids').notNullable(); // Service category IDs with index
    table.smallint('service_duration').notNullable();
    table.smallint('service_status').notNullable().defaultTo(1);
    table.tinyint('is_deleted').notNullable().defaultTo(0);
    table.json('service_image'); // Service image (optional)
    table.integer('created_by').unsigned().notNullable().references('id').inTable('tenant_staff'); // Foreign key reference to tenant_staff
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the tenant_service table
  await knex.schema.dropTableIfExists('tenant_service');
}