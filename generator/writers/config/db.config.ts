// src/generator/writers/DBConfigWriter.ts
import { FileWriter } from '@base/fileWriter.base';
import { Observable } from '@observer/observer';

export class DBConfigWriter extends FileWriter {
  private observable: Observable;

  constructor(observable: Observable) {
    super();
    this.observable = observable;
  }

  protected getDirectoryName(): string {
    return 'src/config';
  }

  protected getFileName(): string {
    return 'databaseConfig.ts';
  }

  protected getFileContent(): string {
    const content = `
		export const databaseConfig = {
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'root',
		password: 'password',
		database: 'example_db',
		};
    `;
    this.observable.notify(content); // Notify observers
    return content;
  }
}
