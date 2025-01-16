"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class ModelWriter extends fileWriter_base_1.FileWriter {
    constructor(modelName) {
        super();
        this.modelName = modelName;
    }
    getDirectoryName() {
        return 'src/models';
    }
    getFileName() {
        return `${this.modelName}.ts`;
    }
    getFileContent() {
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
exports.ModelWriter = ModelWriter;
//# sourceMappingURL=model.writer.js.map