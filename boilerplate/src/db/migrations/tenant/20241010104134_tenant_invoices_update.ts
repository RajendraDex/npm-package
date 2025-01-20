import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_invoices', (table) => {
    table.string('invoice_number', 20); // Adding the new field
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_invoices', (table) => {
    table.dropColumn('invoice_number'); // Dropping the new field if needed
  });
}