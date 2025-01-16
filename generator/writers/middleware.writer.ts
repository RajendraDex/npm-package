// src/generator/writers/MiddlewareWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class MiddlewareWriter extends FileWriter {
  private middlewareName: string;

  constructor(middlewareName: string) {
    super();
    this.middlewareName = middlewareName;
  }

  protected getDirectoryName(): string {
    return 'src/middleware';
  }

  protected getFileName(): string {
    return `${this.middlewareName}Middleware.ts`;
  }

  protected getFileContent(): string {
    return `
import { Request, Response, NextFunction } from 'express';

export const ${this.middlewareName}Middleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('${this.middlewareName} middleware triggered');
  next();
};
    `;
  }
}
