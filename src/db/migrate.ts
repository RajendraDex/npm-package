import { getKnexWithConfig } from './knexfile';
import * as dotenv from 'dotenv';
import { Knex } from 'knex';
import { migrateAllTenantsWithProgress } from '../helpers/tenants/migrationHelper';
import { logger } from '../utils/logger';
dotenv.config();

// Define your default database credentials
const defaultDatabaseCredentials = {
  host: process.env.MASTER_DB_HOST!,
  user: process.env.MASTER_DB_USER!,
  password: process.env.MASTER_DB_PASSWORD!,
  database: process.env.SUPER_DATABASE!, // Connect to the default 'postgres' database first
  port: parseInt(process.env.MASTER_DB_PORT || '5432', 10),
};

/**
 * Creates a new database with the given name.
 * 
 * @param knex - A Knex instance connected to the master database.
 * @param databaseName - The name of the database to create.
 */
const createDatabase = async (knex: Knex, databaseName: string) => {
  try {
    await knex.raw(`CREATE DATABASE "${databaseName}"`);
    logger.info(`Database ${databaseName} created successfully.`);
  } catch (err: any) {
    if (err.code === '42P04') { // PostgreSQL error code for "duplicate database"
      logger.warn(`Database ${databaseName} already exists.`);
    } else {
      logger.error(`Failed to create database ${databaseName}: ${err}`);
      throw err;
    }
  }
};

/**
 * Executes the migration process for the specified database.
 * 
 * @param databaseName - The name of the database to migrate.
 */
const migrateDatabase = async (databaseName: string) => {
  const knexMaster = getKnexWithConfig(defaultDatabaseCredentials, './dist/db/migrations/master');

  // Create the new database before running migrations
  await createDatabase(knexMaster, databaseName);

  // Destroy the Knex connection to the 'postgres' database before proceeding
  await knexMaster.destroy();

  // Configure Knex for the newly created database
  const knexInstance = getKnexWithConfig({
    ...defaultDatabaseCredentials,
    database: databaseName,
  }, './dist/db/migrations/master');

  try {
    logger.info(`Running migrations for the ${databaseName} database...`);
    await knexInstance.migrate.latest(); // Migrate to the latest version
    logger.info(`${databaseName} database migrations completed.`);
  } catch (err) {
    logger.error(`Failed to migrate the ${databaseName} database: ${err}`);
    throw err;
  } finally {
    // Destroy the Knex instance to prevent open connections
    await knexInstance.destroy();
  }
};

/**
 * Executes the migration process for the specified tenant database.
 * 
 * @param tenantName - The name of the tenant database to migrate.
 */
export const migrateTenantDatabase = async (tenantName: string) => {
  const knexMaster = getKnexWithConfig(defaultDatabaseCredentials, './dist/db/migrations/master');

  // Create the new tenant database before running migrations
  await createDatabase(knexMaster, tenantName);

  // Destroy the Knex connection to the 'postgres' database before proceeding
  await knexMaster.destroy();

  // Configure Knex for the newly created tenant database
  const knexInstance = getKnexWithConfig({
    ...defaultDatabaseCredentials,
    database: tenantName,
  }, './dist/db/migrations/tenant');

  try {
    logger.info(`Running migrations for the ${tenantName} tenant database...`);
    await knexInstance.migrate.latest(); // Migrate to the latest version
    logger.info(`${tenantName} tenant database migrations completed.`);
  } catch (err) {
    logger.error(`Failed to migrate the ${tenantName} tenant database: ${err}`);
    throw err;
  } finally {
    // Destroy the Knex instance to prevent open connections
    await knexInstance.destroy();
  }
};

/**
 * Executes the migration process.
 */
const migrateDatabases = async () => {
  await migrateDatabase('scheduling_master');
};

// New function to handle tenant migration from command line
const migrateTenant = async (tenantName: string) => {
  await migrateTenantDatabase(tenantName);
};

// Function to fetch all tenants from the main database
const fetchAllTenants = async (): Promise<Array<{ tenant_subdomain: string }>> => {
  const knexMain = getKnexWithConfig({
    ...defaultDatabaseCredentials,
    database: 'scheduling_master' // Assuming 'saas_scheduling' is your main database
  }, './dist/db/migrations/master');

  try {
    return await knexMain('tenant_master').select('tenant_subdomain');
  } finally {
    await knexMain.destroy();
  }
};

// Function to run latest migrations for all tenants
 export const migrateAllTenants = async () => {
  const tenants = await fetchAllTenants();
  for (const tenant of tenants) {
    await migrateTenantDatabase(tenant.tenant_subdomain);
  }
};

// Modify the command line execution logic
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === 'migrate:tenant:latest') {
    fetchAllTenants().then(tenants => {
      migrateAllTenantsWithProgress(tenants)
        .then(() => {
          logger.info('All tenant migrations completed.');
        })
        .catch((err) => {
          logger.error('Tenant migration process failed:', err);
        });
    });
  } else {
    migrateDatabases() // Call the function to migrate the master database
    .then(() => {
      logger.info('Master database migration completed.');
    })
    .catch((err) => {
      logger.error('Master database migration failed:', err);
    });
  }
}
