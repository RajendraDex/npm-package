// src/generator/writers/ModelWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class ModelWriter extends FileWriter {
  private modelName: string;

  constructor(modelName: string) {
    super();
    this.modelName = modelName;
  }

  protected getDirectoryName(): string {
    return 'src/models';
  }

  protected getFileName(): string {
    return `${this.modelName}.ts`;
  }

  protected getFileContent(): string {
    return `
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${this.modelName} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
    `;
  }
}
