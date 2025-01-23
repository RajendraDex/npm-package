import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('saas_admin', (table) => {
    table.increments('id').primary().notNullable(); // Auto-incrementing integer primary key
    table.uuid('admin_uuid').defaultTo(knex.raw('gen_random_uuid()')).notNullable(); // UUID column
    table.string('first_name', 40).notNullable().index();
    table.string('last_name', 30).notNullable().index();
    table.string('email',50).notNullable().index(); // Adding unique constraint to email
    table.string('password', 60).notNullable();
    table.boolean('status').notNullable().index();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('saas_admin');
}
