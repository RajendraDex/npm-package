import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the tenant_invoice_items table
  await knex.schema.createTable('tenant_invoice_items', (table) => {
    table.increments('id').primary().notNullable(); // Primary key
    table.string('invoice_item_uuid', 64).notNullable(); // Unique identifier for invoice item
    table.integer('invoice_id').unsigned().notNullable().references('id').inTable('tenant_invoices').index();
    table.integer('service_id').unsigned().notNullable().references('id').inTable('tenant_service').index(); // Foreign key reference to tenant_service
    table.integer('provider_id').unsigned().notNullable().references('id').inTable('tenant_staff').index(); // Foreign key reference to tenant_staff
    table.decimal('item_amount').notNullable(); // Item amount
    table.decimal('item_quantity').notNullable(); // Item quantity
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
  });
} 

export async function down(knex: Knex): Promise<void> {
  // Drop the tenant_invoice_items table
  await knex.schema.dropTableIfExists('tenant_invoice_items');
}
