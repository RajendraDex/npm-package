import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('permission_routes_master', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.integer('permission_id').unsigned().notNullable().references('id').inTable('permission_master').onDelete('CASCADE'); // Foreign key to permission_master table with ON DELETE CASCADE
    table.string('route_endpoint').notNullable(); // Endpoint as a non-nullable string
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Timestamp with current timestamp as default
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Timestamp with current timestamp as default and updated on row update
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('permission_routes_master');
}
