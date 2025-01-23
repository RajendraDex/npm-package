import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('promotion_offer', (table) => {
    table.string('promotion_tagline', 300).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('promotion_offer', (table) => {
    table.string('promotion_tagline', 300).nullable().alter(); 
  });
}