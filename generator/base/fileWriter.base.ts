//# Abstract base class (Template Method)
import path from 'path';
import { writeFile, createDir } from '@utils/index';

export abstract class FileWriter {
  protected abstract getDirectoryName(): string;
  protected abstract getFileName(): string;
  protected abstract getFileContent(): string;

  public writeFile(projectPath: string): void {
    const dirPath = path.join(projectPath, this.getDirectoryName());
    createDir(dirPath);

    const filePath = path.join(dirPath, this.getFileName());
    const content = this.getFileContent();

    writeFile(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
}
