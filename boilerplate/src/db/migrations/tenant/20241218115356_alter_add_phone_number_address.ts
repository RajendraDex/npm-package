import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Alter the 'tenant_address' table to add new columns
    await knex.schema.table('tenant_address', (table) => {
        // Add a nullable 'location_phone_number' column with a maximum length of 12 characters
        table.string('location_phone_number', 12).nullable();
        // Add a nullable 'location_country_code' column with a maximum length of 8 characters
        table.string('location_country_code', 8).nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Revert the changes made in the 'up' function by dropping the added columns
    await knex.schema.table('tenant_address', (table) => {
        // Drop the 'location_phone_number' column
        table.dropColumn('location_phone_number');
        // Drop the 'location_country_code' column
        table.dropColumn('location_country_code');
    });
}
