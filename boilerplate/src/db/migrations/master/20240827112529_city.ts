import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('city_master', (table) => {
        table.increments('id').primary(); // Auto-incrementing integer ID
        table.string('city_name').notNullable(); // Ensure city_name is required
        table.integer('state_id').references('id').inTable('state_master').onDelete('CASCADE').notNullable();
        table.integer('country_id').references('id').inTable('country_master').onDelete('CASCADE').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('city_master');
}
