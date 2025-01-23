import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_invoices', (table) => {
    table.decimal('discount_amount', 10, 2).nullable();// Adding a new column 'discount_amount' to store the discount amount
    table.decimal('sub_total', 10, 2).nullable();// Adding a new column 'subtotal' to store the subtotal amount          
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_invoices', (table) => {
    table.dropColumn('discount_amount');
    table.dropColumn('sub_total');
  });
}
