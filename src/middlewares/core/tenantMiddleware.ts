import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import { defaultKnex, getKnexWithConfig } from '../../db/knexfile';
import { logger } from '../../utils/logger'; // Add this import
import { Knex } from 'knex';

dotenv.config();

const knexInstances: Map<string, Knex> = new Map(); // Store Knex instances by config string

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract domain from request body if it exists
    const domainName = req.body.domain || (req.headers['x-request-origin'] || req.query.domain || req.params.domain as string);
    let tenantIdentifier: string | undefined = req.body.domain ? req.body.domain : domainName;
    let knexInstance = defaultKnex; // Start with default Knex instance
    let isTenant = false;
    if (tenantIdentifier) {
      // Use environment variables for DB config
      const tenantDbConfig = {
        host: process.env.MASTER_DB_HOST!, // Get from env
        user: process.env.MASTER_DB_USER!, // Get from env
        password: process.env.MASTER_DB_PASSWORD!, // Get from env
        database: tenantIdentifier, // Use tenantIdentifier as DB name
        port: parseInt(process.env.MASTER_DB_PORT!) || 5432, // Get from env or default
      };

      const configString = JSON.stringify(tenantDbConfig); // Create a unique string for the config
      if (!knexInstances.has(configString)) {
        knexInstance = getKnexWithConfig(tenantDbConfig);
        knexInstances.set(configString, knexInstance); // Store the new instance
        logger.info(`New connection established for tenant: ${tenantIdentifier}`); // Log new connection
      } else {
        knexInstance = knexInstances.get(configString)!; // Reuse the existing instance
        logger.info(`Connection reused for tenant: ${tenantIdentifier}`); // Log reused connection
      }
      isTenant = true;
    }

    // Attach knex instance and tenant flag to the request object
    (req as any).knex = knexInstance;
    (req as any).isTenant = isTenant;

    next();
  } catch (error) {
    logger.error(`Tenant middleware error: ${error}`);
    res.status(500).send(`Middleware error: ${error}`);
  }
};
