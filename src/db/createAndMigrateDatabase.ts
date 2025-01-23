import { getKnexWithConfig } from './knexfile';
import * as dotenv from 'dotenv';
import { logger } from '../utils/logger';
import { TenantInfoMessages } from '../enums/infoMessages';
dotenv.config();

/**
 * Creates a new database if it does not already exist and runs migrations for it.
 *
 * @param tenantCredentials - The credentials to connect to the database server and create the new tenant database.
 */
const createAndMigrateDatabase = async (tenantCredentials: {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}) => {
  // Create the new database using tenant-specific credentials
  const adminKnexInstance = getKnexWithConfig({
    host: tenantCredentials.host,
    user: tenantCredentials.user,
    password: tenantCredentials.password,
    database: process.env.SUPER_DATABASE! || 'postgres', // Default user to connect and create the new tenant database
    port: tenantCredentials.port,
  }, './dist/db/migrations/tenant');

  try {
    logger.info(`${TenantInfoMessages.CreatingDatabase}: ${tenantCredentials.database}`);
    await adminKnexInstance.raw(`CREATE DATABASE "${tenantCredentials.database}"`);
    logger.info(`${TenantInfoMessages.DatabaseCreatedSuccessfully}: ${tenantCredentials.database}`);
  } catch (err) {
    logger.error(`${TenantInfoMessages.DatabaseCreationFailed}: ${tenantCredentials.database}`, err);
    throw err;
  } finally {
    await adminKnexInstance.destroy();
  }

  // Run migrations for the new tenant database
  const tenantKnexInstance = getKnexWithConfig(tenantCredentials, './dist/db/migrations/tenant');

  try {
    logger.info(`${TenantInfoMessages.RunningMigrations}: ${tenantCredentials.database}`);
    await tenantKnexInstance.migrate.latest();
    logger.info(`${TenantInfoMessages.MigrationsCompleted}: ${tenantCredentials.database}`);
  } catch (err) {
    logger.error(`${TenantInfoMessages.MigrationsFailed}: ${tenantCredentials.database}`, err);
    throw err;
  } finally {
    await tenantKnexInstance.destroy();
  }
};

// Export the database initialization function
export const initializeDatabase = async (tenantCredentials: {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}) => {
  try {
    await createAndMigrateDatabase(tenantCredentials);
    logger.info(`${TenantInfoMessages.DatabaseInitializedSuccessfully}: ${tenantCredentials.database}`);
  } catch (err) {
    logger.error(`${TenantInfoMessages.DatabaseInitializationFailed}: ${tenantCredentials.database}`, err);
  }
};
