import { Knex } from 'knex';

// Function to apply the migration
export async function up(knex: Knex): Promise<void> {
    // Create 'tenant_discount' table
    await knex.schema.createTable('tenant_discount', (table) => {
        table.increments('id').primary().notNullable(); // Primary key
        table.string('discount_uuid', 64).notNullable(); // Unique identifier for the discount
        table.string('discount_title', 64).notNullable(); // Name of the discount
        table.string('discount_code', 50).notNullable().unique().index(); // Unique discount code
        table.decimal('discount', 10, 2).nullable(); // Percentage discount value
        table.tinyint('discount_type',1).notNullable().defaultTo(1); // Type of discount (e.g., percentage or fixed)
        table.string('occasion', 50).nullable(); // Occasion for the discount, if any
        table.tinyint('status',1).notNullable().defaultTo(1); // Status of the discount (e.g., active or inactive)
        table.integer('created_by').unsigned().notNullable()
        .references('id').inTable('tenant_staff').onDelete('CASCADE'); // Foreign key to 'tenant_staff' table
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now()); // Timestamp for when the discount was created
        table.datetime('updated_at').notNullable().defaultTo(knex.fn.now()); // Timestamp for when the discount was last updated
    });
}

// Function to rollback the migration
export async function down(knex: Knex): Promise<void> {
    // Drop 'tenant_discount' table if it exists
    await knex.schema.dropTableIfExists('tenant_discount');
}
