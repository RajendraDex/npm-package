import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    table.string('email_id', 50).nullable().alter(); // Altering the email_id field to accept null values
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    table.string('email_id', 50).notNullable().alter(); // Reverting back to not nullable
  });
}