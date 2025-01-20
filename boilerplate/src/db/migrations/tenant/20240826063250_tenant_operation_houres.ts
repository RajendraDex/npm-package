import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create the tenant_operation_hours table
  await knex.schema.createTable('tenant_operation_hours', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.integer('tenant_address_id').unsigned().notNullable().index(); // Foreign key to tenant_address
    table.enu('day_of_week', ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).notNullable().index(); // Day of the week
    table.time('start_time').index(); // Start time
    table.time('end_time').index();// End time
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Updated at timestamp with update on change

      table.foreign('tenant_address_id').references('id').inTable('tenant_address').onDelete('CASCADE').onUpdate('CASCADE'); // Delete and update cascade
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the tenant_operation_hours table
  await knex.schema.dropTableIfExists('tenant_operation_hours');
}
