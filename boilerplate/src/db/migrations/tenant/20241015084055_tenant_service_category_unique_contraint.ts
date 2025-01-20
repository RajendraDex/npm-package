import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add unique constraint to category_name in tenant_service_categories table
  await knex.schema.alterTable('tenant_service_categories', (table) => {
    table.string('category_name').unique().alter(); // Make category_name unique
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove unique constraint from category_name
  await knex.schema.alterTable('tenant_service_categories', (table) => {
    table.dropUnique(['category_name']); // Remove uniqueness
  });
}