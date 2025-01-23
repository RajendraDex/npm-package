// src/helpers/migrationHelper.ts
import * as async from 'async';
import { SingleBar, Presets } from 'cli-progress';
import { migrateTenantDatabase } from '../../db/migrate';
import { logger } from '../../utils/logger';

export const migrateAllTenantsWithProgress = async (tenants: Array<{ tenant_subdomain: string }>) => {
  const progressBar = new SingleBar({}, Presets.rect);
  
  logger.info('Starting tenant migrations...');
  progressBar.start(tenants.length, 0);

  const queue = async.queue(async (tenant: { tenant_subdomain: string }) => {
    try {
      await migrateTenantDatabase(tenant.tenant_subdomain);
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      progressBar.increment();
      logger.info(`${tenant.tenant_subdomain} tenant database migrations completed.`);
    } catch (err) {
      logger.error(`Failed to migrate tenant ${tenant.tenant_subdomain}:`, err);
      throw err; // Let async.queue handle the error
    }
  }, 1); // Number of concurrent migrations, adjust as needed

  queue.push(tenants);

  queue.drain(() => {
    progressBar.stop();
    logger.info('All tenant migrations completed.');
  });

  queue.error((err, task) => {
    logger.error('A tenant migration task failed:', err);
  });
};