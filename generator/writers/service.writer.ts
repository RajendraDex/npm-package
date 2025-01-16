// src/generator/writers/ServiceWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class ServiceWriter extends FileWriter {
  private serviceName: string;

  constructor(serviceName: string) {
    super();
    this.serviceName = serviceName;
  }

  protected getDirectoryName(): string {
    return 'src/services';
  }

  protected getFileName(): string {
    return `${this.serviceName}Service.ts`;
  }

  protected getFileContent(): string {
    return `
import { ${this.serviceName}Repository } from '../repositories/${this.serviceName}Repository';

export class ${this.serviceName}Service {
  private repository: ${this.serviceName}Repository;

  constructor(repository: ${this.serviceName}Repository) {
    this.repository = repository;
  }

  public async findAll() {
    return this.repository.find();
  }
}
    `;
  }
}
