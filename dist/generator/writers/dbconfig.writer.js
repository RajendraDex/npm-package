"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfigWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class DBConfigWriter extends fileWriter_base_1.FileWriter {
    getDirectoryName() {
        return 'src/config';
    }
    getFileName() {
        return 'databaseConfig.ts';
    }
    getFileContent() {
        return `
export const databaseConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'root',
  password: 'password',
  database: 'example_db',
};
    `;
    }
}
exports.DBConfigWriter = DBConfigWriter;
//# sourceMappingURL=dbconfig.writer.js.map