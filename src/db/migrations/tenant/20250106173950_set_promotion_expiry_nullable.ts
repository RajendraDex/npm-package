import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('promotion_customer_link', (table) => {
        table.date('expiry_date').nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('promotion_customer_link', (table) => {
        table.date('expiry_date').notNullable().alter();
    });
}
