import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('tenant_customer_transactions', (table) => {
        table.increments('id').primary(); // Primary key for the table
        table.integer('customer_id').references('id').inTable('tenant_customers').index(); // Foreign key referencing tenant_customers table
        table.string('transaction_id', 255).notNullable().index(); // Unique transaction identifier
        table.decimal('transaction_amount', 10, 2).notNullable().index(); // Transaction amount with precision
        table.enum('transaction_type', ['C', 'D']).notNullable(); // Type of transaction: Credit (C) or Debit (D)
        table.string('transaction_remarks', 255).nullable(); // Optional remarks for the transaction
        table.date('transaction_date').notNullable(); // Date of the transaction
        table.tinyint('transaction_mode').notNullable(); // Mode of transaction
        table.integer('booking_id').references('id').inTable('tenant_booking').index(); // Foreign key referencing tenant_bookings table
        table.integer('invoice_id').references('id').inTable('tenant_invoices').index(); // Foreign key referencing tenant_invoices table
        table.integer('promo_id').references('id').inTable('promotion_offer').index(); // Foreign key referencing tenant_promotions table
        table.tinyint('transaction_by_user_type'); // Type of user who made the transaction
        table.integer('transaction_by_user_id');
        table.tinyint('is_deleted').defaultTo(0).index(); // Deletion flag with default value 0
        table.tinyint('status').defaultTo(1).index(); // Status flag with default value 1
        table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for record creation
        table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for record update
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('tenant_customer_transactions'); // Drop the tenant_customer_transactions table
}
