import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the role_link table
  await knex.schema.createTable('role_link', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.integer('staff_id').unsigned().notNullable()
    table.integer('role_id').unsigned().notNullable()
      .references('id').inTable('roles').onDelete('CASCADE'); // Foreign key to roles table
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp with auto-update
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the role_link table
  await knex.schema.dropTableIfExists('role_link');
}
