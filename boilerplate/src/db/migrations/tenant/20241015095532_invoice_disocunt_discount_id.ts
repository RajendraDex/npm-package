import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('tenant_invoices', 'discount_id');
  if (!hasColumn) {
    await knex.schema.table('tenant_invoices', (table) => {
      table.integer('discount_id').unsigned().nullable().references('id').inTable('tenant_discount');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_invoices', (table) => {
    table.dropColumn('discount_id');
  });
}
