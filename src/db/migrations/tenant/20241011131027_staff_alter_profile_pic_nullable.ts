import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_staff', (table) => {
    table.string('profile_pic', 255).nullable().alter(); // Make profile_pic nullable
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tenant_staff', (table) => {
    table.string('profile_pic', 255).notNullable().alter(); // Revert profile_pic to not nullable
  });
}