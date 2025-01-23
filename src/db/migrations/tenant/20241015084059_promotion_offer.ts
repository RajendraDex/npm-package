import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('promotion_offer', (table) => {
    table.increments('id').primary().notNullable();
    table.string('promotion_uuid',64).notNullable();
    table.string('promotion_name', 45).notNullable();
    table.string('promotion_tagline', 255).nullable();
    table.date('start_date');
    table.tinyint('offer_duration', 2).notNullable();
    table.integer('created_by').unsigned().references('id').inTable('tenant_staff');
    table.tinyint('offer_status').defaultTo(1).notNullable();
    table.decimal('pay_price', 10, 2).notNullable();
    table.decimal('get_price', 10, 2).notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable();
    table.datetime('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('promotion_offer');
}
