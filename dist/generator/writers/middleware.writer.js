"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class MiddlewareWriter extends fileWriter_base_1.FileWriter {
    constructor(middlewareName) {
        super();
        this.middlewareName = middlewareName;
    }
    getDirectoryName() {
        return 'src/middleware';
    }
    getFileName() {
        return `${this.middlewareName}Middleware.ts`;
    }
    getFileContent() {
        return `
import { Request, Response, NextFunction } from 'express';

export const ${this.middlewareName}Middleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('${this.middlewareName} middleware triggered');
  next();
};
    `;
    }
}
exports.MiddlewareWriter = MiddlewareWriter;
//# sourceMappingURL=middleware.writer.js.map