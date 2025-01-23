import { Knex } from 'knex';

// Function to apply the migration
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_address', (table) => {
    table.tinyint('address_type').nullable();
    table.tinyint('status').nullable().defaultTo(1);
  });
}

// Function to rollback the migration
export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_address', (table) => {
    table.dropColumn('address_type');
    table.dropColumn('status');
  });
}
