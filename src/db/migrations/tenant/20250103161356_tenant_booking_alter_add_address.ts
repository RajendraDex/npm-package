import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Alter the 'tenant_booking' table to add a new column 'address_id'
    await knex.schema.alterTable('tenant_booking', (table) => {
        // Add 'address_id' column which references 'id' in 'tenant_address' table
        table.integer('address_id').unsigned().nullable().references('id').inTable('tenant_address').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Revert the changes made in the 'up' function by dropping the 'address_id' column
    await knex.schema.alterTable('tenant_booking', (table) => {
        table.dropColumn('address_id');
    });
}
