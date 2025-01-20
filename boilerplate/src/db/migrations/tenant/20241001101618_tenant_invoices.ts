import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_invoices', (table) => {
    table.increments('id').primary().notNullable();
    table.string('invoice_uuid', 64).notNullable();
    table.integer('customer_id').unsigned().notNullable();
    table.foreign('customer_id').references('id').inTable('tenant_customers');
    table.date('service_date');
    table.decimal('invoice_amount');
    table.tinyint('invoice_status').notNullable().defaultTo(1);
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_invoices');
}
