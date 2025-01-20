import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    table.integer('otp').nullable(); // Adding the otp field
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    table.dropColumn('otp'); // Dropping the otp field if needed
  });
}