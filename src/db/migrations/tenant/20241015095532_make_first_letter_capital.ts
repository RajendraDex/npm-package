import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Update tenant_staff first_name and last_name
  await knex.raw(`
    UPDATE tenant_staff
    SET first_name = CONCAT(UPPER(LEFT(first_name, 1)), SUBSTRING(first_name, 2)),
        last_name = CASE WHEN last_name IS NOT NULL THEN CONCAT(UPPER(LEFT(last_name, 1)), SUBSTRING(last_name, 2)) ELSE last_name END
    WHERE first_name IS NOT NULL;
  `);

  // Update tenant_customers first_name and last_name
  await knex.raw(`
    UPDATE tenant_customers
    SET first_name = CONCAT(UPPER(LEFT(first_name, 1)), SUBSTRING(first_name, 2)),
        last_name = CASE WHEN last_name IS NOT NULL THEN CONCAT(UPPER(LEFT(last_name, 1)), SUBSTRING(last_name, 2)) ELSE last_name END
    WHERE first_name IS NOT NULL;
  `);

  // Update tenant_service_categories category_name
  await knex.raw(`
    UPDATE tenant_service_categories
    SET category_name = CONCAT(UPPER(LEFT(category_name, 1)), SUBSTRING(category_name, 2))
    WHERE category_name IS NOT NULL;
  `);

  // Update tenant_service service_name
  await knex.raw(`
    UPDATE tenant_service
    SET service_name = CONCAT(UPPER(LEFT(service_name, 1)), SUBSTRING(service_name, 2))
    WHERE service_name IS NOT NULL;
  `);
}

export async function down(knex: Knex): Promise<void> {
  // No rollback behavior defined as original casing is not stored
}
