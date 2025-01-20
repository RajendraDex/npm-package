import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_booking', (table) => {
    table.increments('id').primary(); // Primary key
    table.string('booking_uuid', 64).notNullable(); // Unique booking identifier
    table.integer('customer_id').unsigned().notNullable().references('id').inTable('tenant_customers').onDelete('CASCADE'); // Foreign key to tenant_customers
    table.string('booking_time'); // Time of the booking
    table.string('booking_date'); // Date of the booking
    table.tinyint('booking_type'); // 1: in-person, 2: virtual
    table.string('booking_number',30).notNullable(); // Booking number
    table.integer('provider_id').unsigned().nullable().references('id').inTable('tenant_staff'); // Foreign key to tenant_staff
    table.tinyint('booking_status').notNullable(); // 1: Booking Created, 2: Approved By Provider, 3: Cancelled
    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable(); // Created at timestamp
    table.datetime('updated_at').defaultTo(knex.fn.now()).notNullable(); // Updated at timestamp with auto-update
    table.integer('created_by');
    table.tinyint('created_by_user_type').defaultTo(1); // 1: Staff, 2: Super Admin
    table.specificType('services_ids', 'integer ARRAY').nullable(); // Services related to the booking, optional, stored as an array of integers
  });

  await knex.raw(`
    CREATE OR REPLACE FUNCTION insert_booking_number()
    RETURNS TRIGGER AS $$
    DECLARE
        domain_prefix VARCHAR(3);
        series_number VARCHAR(4);
    BEGIN
        domain_prefix := UPPER(SUBSTRING(current_database(), 1, 3));
        series_number := LPAD((NEW.id)::TEXT, 4, '0');
        NEW.booking_number := domain_prefix || '-BK-' || series_number;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER before_insert_tenant_booking
    BEFORE INSERT ON tenant_booking
    FOR EACH ROW
    EXECUTE FUNCTION insert_booking_number();
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_booking');

  await knex.raw(`
    DROP TRIGGER IF EXISTS before_insert_tenant_booking ON tenant_booking;
    DROP FUNCTION IF EXISTS insert_booking_number();
`);
}
