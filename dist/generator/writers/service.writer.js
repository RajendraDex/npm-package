"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class ServiceWriter extends fileWriter_base_1.FileWriter {
    constructor(serviceName) {
        super();
        this.serviceName = serviceName;
    }
    getDirectoryName() {
        return 'src/services';
    }
    getFileName() {
        return `${this.serviceName}Service.ts`;
    }
    getFileContent() {
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
exports.ServiceWriter = ServiceWriter;
//# sourceMappingURL=service.writer.js.map