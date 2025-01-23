import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Change the staff_commission column type to decimal
  await knex.schema.table('tenant_staff', (table) => {
    table.decimal('staff_commission', 5, 2).defaultTo(0).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove the staff_commission column if it exists
  await knex.schema.table('tenant_staff', (table) => {
    table.dropColumn('staff_commission');
  });
}
