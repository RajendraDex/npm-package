import knex, { Knex } from 'knex';
import * as fs from 'fs';
import * as dotenv from 'dotenv';


dotenv.config();

const defaultDbConfig = {
  host: process.env.MASTER_DB_HOST as string,
  user: process.env.MASTER_DB_USER as string,
  password: process.env.MASTER_DB_PASSWORD as string,
  database: process.env.MASTER_DB_NAME as string,
  port: parseInt(process.env.MASTER_DB_PORT || '5432', 10),
};
export const getKnexWithConfig = (
  credentials: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  },
  migrationDirectory?: string
): Knex => {
  const isLocalEnv = process.env.NODE_ENV === 'local';
  const isTestEnv = process.env.NODE_ENV === 'test';

  const sslConfig = !isLocalEnv && !isTestEnv && process.env.PG_CERT_PATH
    ? {
        ssl: {
          ca: fs.readFileSync(process.env.PG_CERT_PATH).toString(),
          rejectUnauthorized: true 
        }
      }
    : {};

  const config: Knex.Config = {
    client: 'pg',
    connection: {
      host: credentials.host,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
      port: credentials.port,
      ...sslConfig,
    },
    pool: { 
      min: parseInt(process.env.DB_POOL_MIN || '2', 10), // Min connections from env
      max: parseInt(process.env.DB_POOL_MAX || '20', 10), // Max connections from env
      acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '10000', 10), // Acquire timeout from env
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10), // Idle timeout from env
    },
  };

  if (migrationDirectory) {
    config.migrations = {
      directory: migrationDirectory,
    };
  }

  return knex(config); 
};

export const defaultKnex = getKnexWithConfig(defaultDbConfig);