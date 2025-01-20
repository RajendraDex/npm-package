import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Add invoice_id to the tenant_booking table
    await knex.schema.table('tenant_booking', (table) => {
        table.integer('invoice_id').unsigned().nullable().references('id').inTable('tenant_invoices');
    });

    // Add booking_id to the tenant_invoices table
    await knex.schema.table('tenant_invoices', (table) => {
        table.integer('booking_id').unsigned().nullable().references('id').inTable('tenant_booking');
    });
}

export async function down(knex: Knex): Promise<void> {
    // Remove invoice_id from the tenant_booking table
    await knex.schema.table('tenant_booking', (table) => {
        table.dropColumn('invoice_id');
    });

    // Remove booking_id from the tenant_invoices table
    await knex.schema.table('tenant_invoices', (table) => {
        table.dropColumn('booking_id');
    });
}
