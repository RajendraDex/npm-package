"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class RepositoryWriter extends fileWriter_base_1.FileWriter {
    constructor(repositoryName) {
        super();
        this.repositoryName = repositoryName;
    }
    getDirectoryName() {
        return 'src/repositories';
    }
    getFileName() {
        return `${this.repositoryName}Repository.ts`;
    }
    getFileContent() {
        return `
import { EntityRepository, Repository } from 'typeorm';
import { ${this.repositoryName} } from '../models/${this.repositoryName}';

@EntityRepository(${this.repositoryName})
export class ${this.repositoryName}Repository extends Repository<${this.repositoryName}> {}
    `;
    }
}
exports.RepositoryWriter = RepositoryWriter;
//# sourceMappingURL=repository.writer.js.map