"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class ControllerWriter extends fileWriter_base_1.FileWriter {
    constructor(controllerName) {
        super();
        this.controllerName = controllerName;
    }
    getDirectoryName() {
        return 'src/controllers';
    }
    getFileName() {
        return `${this.controllerName}Controller.ts`;
    }
    getFileContent() {
        return `
import { Request, Response } from 'express';

export class ${this.controllerName}Controller {
  public async get(req: Request, res: Response): Promise<void> {
    res.send('${this.controllerName} fetched successfully!');
  }

  public async create(req: Request, res: Response): Promise<void> {
    res.send('${this.controllerName} created successfully!');
  }
}
    `;
    }
}
exports.ControllerWriter = ControllerWriter;
//# sourceMappingURL=controller.writer.js.map