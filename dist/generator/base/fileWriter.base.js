"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWriter = void 0;
const path_1 = __importDefault(require("path"));
const index_1 = require("@utils/index");
class FileWriter {
    writeFile(projectPath) {
        const dirPath = path_1.default.join(projectPath, this.getDirectoryName());
        (0, index_1.createDir)(dirPath);
        const filePath = path_1.default.join(dirPath, this.getFileName());
        const content = this.getFileContent();
        (0, index_1.writeFile)(filePath, content);
        console.log(`Created file: ${filePath}`);
    }
}
exports.FileWriter = FileWriter;
//# sourceMappingURL=fileWriter.base.js.map