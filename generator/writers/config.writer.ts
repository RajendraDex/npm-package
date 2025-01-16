// src/generator/writers/ConfigWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class ConfigWriter extends FileWriter {
  protected getDirectoryName(): string {
    return 'src/config';
  }

  protected getFileName(): string {
    return 'appConfig.ts';
  }

  protected getFileContent(): string {
    return `
export const appConfig = {
  port: 3000,
  environment: 'development',
};
    `;
  }
}
