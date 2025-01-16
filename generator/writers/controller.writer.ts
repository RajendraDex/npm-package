// src/generator/writers/ControllerWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class ControllerWriter extends FileWriter {
  private controllerName: string;

  constructor(controllerName: string) {
    super();
    this.controllerName = controllerName;
  }

  protected getDirectoryName(): string {
    return 'src/controllers';
  }

  protected getFileName(): string {
    return `${this.controllerName}Controller.ts`;
  }

  protected getFileContent(): string {
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
