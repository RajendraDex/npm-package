import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_master', (table) => {
    table.string('tenant_username', 65).nullable(); // Add tenant_username column
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_master', (table) => {
    table.dropColumn('tenant_username'); // Remove tenant_username column if rolled back
  });
}