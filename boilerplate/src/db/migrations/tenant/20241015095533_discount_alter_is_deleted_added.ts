import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add 'is_deleted' column and alter 'discount_code' to be non-unique
  await knex.schema.table('tenant_discount', (table) => {
    table.tinyint('is_deleted').defaultTo(0);
    table.dropUnique(['discount_code']); // Assuming 'discount_code' was unique
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove 'is_deleted' column and revert 'discount_code' to unique
  await knex.schema.table('tenant_discount', (table) => {
    table.dropColumn('is_deleted');
    table.unique('discount_code'); // Re-apply unique constraint if needed
  });
}