import { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    // Adding a new column 'date_of_exit' to the 'staff_provider' table
    await knex.schema.table('tenant_staff', (table) => {
        table.date('date_of_exit').nullable();
    });
}
export async function down(knex: Knex): Promise<void> {
    // Dropping the 'date_of_exit' column from the 'staff_provider' table
    await knex.schema.table('tenant_staff', (table) => {
        table.dropColumn('date_of_exit');
    });
}