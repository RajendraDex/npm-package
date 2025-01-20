import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tenant_customer_wallet', (table) => {
        table.increments('id').primary(); // Primary key
        table.integer('customer_id').references('id').inTable('tenant_customers').index(); // Foreign key referencing tenant_customers table
        table.decimal('current_balance', 10, 2).defaultTo(0).index(); // Current balance with default value 0
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for record creation
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for record update
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tenant_customer_wallet'); // Drop the tenant_customer_wallet table
}