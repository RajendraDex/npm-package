"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMConfigWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class TypeORMConfigWriter extends fileWriter_base_1.FileWriter {
    getDirectoryName() {
        return 'src/config';
    }
    getFileName() {
        return 'typeormConfig.ts';
    }
    getFileContent() {
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
exports.TypeORMConfigWriter = TypeORMConfigWriter;
//# sourceMappingURL=ormconfig.writer.js.map