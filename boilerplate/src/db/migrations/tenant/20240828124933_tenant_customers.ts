import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_customers', (table) => {
    table.increments('id').primary();
    table.string('customer_uuid', 64).notNullable();
    table.string('first_name', 40).notNullable();
    table.string('last_name', 30).notNullable();
    table.string('email_id', 50).notNullable();
    table.string('country_code', 8).notNullable();
    table.string('phone_number', 12).notNullable();
    table.string('password', 60);
    table.string('user_name',30);
    table.tinyint('customer_status').notNullable().defaultTo(1);
    table.tinyint('is_deleted').notNullable().defaultTo(0)
    table.enu('customer_gender', ['m', 'f', 'o']).notNullable();
    table.string('profile_pic',255).nullable();
    table.json('additional_info');
    table.datetime('created_at').notNullable();
    table.datetime('updated_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_customers');
}
