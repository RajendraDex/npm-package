import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('promotion_customer_link', (table) => {
        table.tinyint('link_status').defaultTo(1);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('promotion_customer_link', (table) => {
        table.dropColumn('link_status');
    });
}

