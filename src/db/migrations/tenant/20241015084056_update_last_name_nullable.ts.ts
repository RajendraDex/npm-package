import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_customers', (table) => {
    table.string('last_name', 30).nullable().alter(); // Change last_name to be nullable
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_customers', (table) => {
    table.string('last_name', 30).notNullable().alter(); // Revert last_name to not nullable
  });
}