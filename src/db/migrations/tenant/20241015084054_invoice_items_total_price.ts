import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add the total_price column with a temporary default value
  await knex.schema.table('tenant_invoice_items', (table) => {
    table.decimal('total_price', 8, 2).defaultTo(0); // Set a default value
  });

  // Update the total_price column with the product of item_amount and item_quantity
  await knex('tenant_invoice_items')
    .update({
      total_price: knex.raw('?? * ??', ['item_amount', 'item_quantity'])
    });

  // Alter the column to remove the default value and make it not nullable
  await knex.schema.alterTable('tenant_invoice_items', (table) => {
    table.decimal('total_price', 8, 2).notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the total_price column if it exists
  await knex.schema.table('tenant_invoice_items', (table) => {
    table.dropColumn('total_price');
  });
}