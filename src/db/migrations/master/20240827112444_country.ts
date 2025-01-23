import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('country_master', (table) => {
        table.increments('id').primary(); // Auto-incrementing integer ID
        table.string('country_name').notNullable().unique(); // Ensure country_name is unique
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('country_master');
}
