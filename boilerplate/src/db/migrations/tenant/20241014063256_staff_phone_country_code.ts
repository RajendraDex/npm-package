import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_staff', (table) => {
    table.string('phone_country_code', 8).nullable(); // Add new column
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_staff', (table) => {
    table.dropColumn('phone_country_code'); // Remove the column
  });
}