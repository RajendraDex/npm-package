import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('promotion_customer_link', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable().references('id').inTable('tenant_customers');
    table.integer('promo_id').unsigned().notNullable().references('id').inTable('promotion_offer');
    table.date('purchase_date').notNullable();
    table.date('expiry_date').notNullable();
    table.decimal('pay_price', 10, 2).notNullable();
    table.decimal('get_price', 10, 2).notNullable();
    table.decimal('consumed_points', 10, 2).defaultTo(0.00).notNullable();
    table.tinyint('is_deleted').notNullable().defaultTo(0);
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.datetime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('promotion_customer_link');
}
