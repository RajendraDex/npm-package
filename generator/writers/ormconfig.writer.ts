// src/generator/writers/TypeORMConfigWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class TypeORMConfigWriter extends FileWriter {
  protected getDirectoryName(): string {
    return 'src/config';
  }

  protected getFileName(): string {
    return 'typeormConfig.ts';
  }

  protected getFileContent(): string {
    return `
import { databaseConfig } from './databaseConfig';

export const typeOrmConfig = {
  ...databaseConfig,
  entities: ['./src/models/*.ts'],
  synchronize: true,
};
    `;
  }
}
