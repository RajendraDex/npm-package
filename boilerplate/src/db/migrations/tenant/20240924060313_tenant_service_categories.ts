import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the tenant_service_categories table
  await knex.schema.createTable('tenant_service_categories', (table) => {
    table.increments('id').primary().notNullable(); // Primary key
    table.string('service_category_uuid', 64).notNullable(); // Unique identifier for service category
    table.string('category_name', 50).notNullable(); // Category name
    table.text('category_description'); // Category description (optional)
    table.string('category_image', 255); // Category image URL (optional)
    table.integer('parent_id').unsigned().references('id').inTable('tenant_service_categories').onDelete('CASCADE'); // Foreign key reference to parent category with onDelete cascade
    table.integer('created_by').notNullable(); // Created by
    table.tinyint('is_deleted').notNullable().defaultTo(0);
    table.tinyint('status').notNullable().defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp with auto-update
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the tenant_service_categories table
  await knex.schema.dropTableIfExists('tenant_service_categories');
}