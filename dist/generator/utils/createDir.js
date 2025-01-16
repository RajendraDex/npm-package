"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDir = void 0;
const fs_1 = require("fs");
const createDir = async (dirPath) => {
    try {
        await fs_1.promises.mkdir(dirPath, { recursive: true });
        console.log(`Directory created or already exists: ${dirPath}`);
    }
    catch (error) {
        console.error(`Error creating directory at ${dirPath}: ${error.message}`);
        throw error;
    }
};
exports.createDir = createDir;
//# sourceMappingURL=createDir.js.map