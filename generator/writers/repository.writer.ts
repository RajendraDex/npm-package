// src/generator/writers/RepositoryWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class RepositoryWriter extends FileWriter {
  private repositoryName: string;

  constructor(repositoryName: string) {
    super();
    this.repositoryName = repositoryName;
  }

  protected getDirectoryName(): string {
    return 'src/repositories';
  }

  protected getFileName(): string {
    return `${this.repositoryName}Repository.ts`;
  }

  protected getFileContent(): string {
    return `
import { EntityRepository, Repository } from 'typeorm';
import { ${this.repositoryName} } from '../models/${this.repositoryName}';

@EntityRepository(${this.repositoryName})
export class ${this.repositoryName}Repository extends Repository<${this.repositoryName}> {}
    `;
  }
}
