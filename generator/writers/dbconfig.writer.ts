// src/generator/writers/DBConfigWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class DBConfigWriter extends FileWriter {
  protected getDirectoryName(): string {
    return 'src/config';
  }

  protected getFileName(): string {
    return 'databaseConfig.ts';
  }

  protected getFileContent(): string {
    return `
export const databaseConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'example_db',
};
    `;
  }
}
