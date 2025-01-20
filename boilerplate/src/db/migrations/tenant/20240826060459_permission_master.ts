import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create ENUM type for permission_operations if it does not exist
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_operations_enum') THEN
        CREATE TYPE permission_operations_enum AS ENUM ('create', 'read', 'update', 'delete');
      END IF;
    END $$;
  `);

  // Create the permission_master table
  await knex.schema.createTable('permission_master', (table) => {
    table.increments('id').primary(); // Auto-incrementing primary key
    table.string('permission_name', 80).notNullable().unique(); // Unique permission name
    table.string('permission_description', 100); // Optional description
    table.specificType('permission_operations', 'permission_operations_enum[]'); // Array of ENUM type
    table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp with current timestamp as default
    table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp with current timestamp as default
    table.integer('created_by').unsigned(); // Column to reference saas_admin table
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the permission_master table
  await knex.schema.dropTableIfExists('permission_master');

  // Optionally, drop the ENUM type
  await knex.raw(`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'permission_operations_enum'
      ) AND NOT EXISTS (
        SELECT 1 FROM pg_enum WHERE enumtypid = 'permission_operations_enum'::regtype
      ) THEN
        DROP TYPE permission_operations_enum;
      END IF;
    END $$;
  `);
}
