import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tenant_discount', (table) => {
        // Rename 'discount' to 'discount_rate'
        table.renameColumn('discount', 'discount_rate');
        // Remove 'discount_type' column
        table.dropColumn('discount_type');
        // Add 'max_invoice_amount' column
        table.decimal('max_invoice_amount', 10, 2).nullable();
        // Add 'flat_discount' column
        table.decimal('flat_discount', 10, 2).nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('tenant_discount', (table) => {
        // Rename 'discount_rate' back to 'discount'
        table.renameColumn('discount_rate', 'discount');
        // Re-add 'discount_type' column
        table.tinyint('discount_type', 1).notNullable().defaultTo(1);
        // Remove 'max_invoice_amount' column
        table.dropColumn('max_invoice_amount');
        // Remove 'flat_discount' column
        table.dropColumn('flat_discount');
    });
}