import { Knex } from 'knex';

// This function is used to apply the migration
export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    // Add a new column 'customer_dob' to the 'tenant_customers' table
    table.string('customer_dob', 12).nullable();
  });
}

// This function is used to rollback the migration
export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_customers', (table) => {
    // Remove the 'customer_dob' column from the 'tenant_customers' table
    table.dropColumn('customer_dob');
  });
} 