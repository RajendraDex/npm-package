import { Knex } from 'knex';

// Up migration to alter the table and add/modify columns
export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_address', (table) => {
    table.string('country_code', 8).notNullable().alter(); // Ensure the country_code column is altered to string with max length 8 and not nullable
    table.string('alternate_phone_country_code', 8).nullable(); // Add new field for alternate phone number country code
  });
}

// Down migration to rollback the changes made in the up migration
export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_address', (table) => {
    table.dropColumn('alternate_phone_country_code'); // Remove the alternate phone country code column if rolling back
    // No need to drop 'country_code' as it's an alteration, not an addition
  });
}
