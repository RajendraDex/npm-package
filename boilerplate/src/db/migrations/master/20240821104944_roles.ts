import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id').primary(); // Primary key
    table.string('role_name', 60).notNullable().unique(); // Unique constraint
    table.string('role_description', 100);
    table.json('role_permissions').notNullable(); // JSON column for permissions
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp with current timestamp as default
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp with current timestamp as default
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('roles');
}
