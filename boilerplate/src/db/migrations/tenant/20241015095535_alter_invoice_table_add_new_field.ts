import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tenant_invoices', (table) => {
        table.decimal('discount_rate', 10, 2).nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tenant_invoices', (table) => {
        table.dropColumn('discount_rate');
    });
}