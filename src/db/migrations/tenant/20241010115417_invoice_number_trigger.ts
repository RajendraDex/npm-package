import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE OR REPLACE FUNCTION insert_invoice_number()
        RETURNS TRIGGER AS $$
        DECLARE
            domain_prefix VARCHAR(3);
            current_year VARCHAR(2);
            series_number VARCHAR(4);
        BEGIN
            domain_prefix := UPPER(SUBSTRING(current_database(), 1, 3));
            current_year := TO_CHAR(CURRENT_DATE, 'YY');
            series_number := LPAD((NEW.id)::TEXT, 4, '0');
            NEW.invoice_number := domain_prefix || '-' || current_year || '-' || series_number;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER before_insert_tenant_invoices
        BEFORE INSERT ON tenant_invoices
        FOR EACH ROW
        EXECUTE FUNCTION insert_invoice_number();
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP TRIGGER IF EXISTS before_insert_tenant_invoices ON tenant_invoices;
        DROP FUNCTION IF EXISTS insert_invoice_number();
    `);
}
