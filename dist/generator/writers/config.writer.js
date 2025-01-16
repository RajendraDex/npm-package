"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class ConfigWriter extends fileWriter_base_1.FileWriter {
    getDirectoryName() {
        return 'src/config';
    }
    getFileName() {
        return 'appConfig.ts';
    }
    getFileContent() {
        return `
export const appConfig = {
  port: 3000,
  environment: 'development',
};
    `;
    }
}
exports.ConfigWriter = ConfigWriter;
//# sourceMappingURL=config.writer.js.map