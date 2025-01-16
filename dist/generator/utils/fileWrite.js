"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const createDir_1 = require("./createDir");
const writeFile = async (filePath, content) => {
    try {
        const dirPath = (0, path_1.dirname)(filePath);
        await (0, createDir_1.createDir)(dirPath);
        await fs_1.promises.writeFile(filePath, content, 'utf8');
        console.log(`File written successfully: ${filePath}`);
    }
    catch (error) {
        console.error(`Error writing file at ${filePath}: ${error.message}`);
        throw error;
    }
};
exports.writeFile = writeFile;
//# sourceMappingURL=fileWrite.js.map