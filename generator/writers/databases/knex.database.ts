import { FileWriter } from '@base/fileWriter.base';

export class KnexDatabaseWriter extends FileWriter {
  protected getDirectoryName(): string {
    return 'src/api/core/databases';
  }

  protected getFileName(): string {
    return 'knexfile.ts';
  }

  protected getFileContent(): string {
    return `
      import type { Knex } from "knex";

      const config: { [key: string]: Knex.Config } = {
        development: {
          client: "postgresql",
          connection: {
            database: "my_db",
            user: "username",
            password: "password"
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: "knex_migrations"
          }
        },

        staging: {
          client: "postgresql",
          connection: {
            database: "my_db",
            user: "username",
            password: "password"
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: "knex_migrations"
          }
        },

        production: {
          client: "postgresql",
          connection: {
            database: "my_db",
            user: "username",
            password: "password"
          },
          pool: {
            min: 2,
            max: 10
          },
          migrations: {
            tableName: "knex_migrations"
          }
        }

      };

      export default config;
    `;
  }
}