import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('state_master', (table) => {
        table.increments('id').primary(); // Auto-incrementing integer ID
        table.string('state_name').notNullable(); // Limit length to 50 characters
        table.integer('country_id').references('id').inTable('country_master').onDelete('CASCADE').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('state_master');
}
