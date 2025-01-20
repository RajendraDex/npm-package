import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_master', (table) => {
    table.string('profile_pic', 255).nullable();
    table.string('country_code', 8).notNullable().alter(); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('tenant_master', (table) => {
    table.dropColumn('profile_pic'); 
    table.string('country_code', 8).notNullable().alter(); 
  });
}
