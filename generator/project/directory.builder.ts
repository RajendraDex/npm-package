import * as path from 'path';
import { createDir } from '@utils/createDir';

/**
 * Class to build a directory structure for the project.
 */
export class DirectoryBuilder {
  private readonly basePath: string;

  constructor(basePath: string) {
    if (!basePath) {
      throw new Error('Base path must be provided.');
    }
    this.basePath = basePath;
  }

  /**
   * Generates the list of directories to be created.
   * @returns An array of directory paths.
   */
  private getDirectoryStructure(): string[] {
    const projectPath = path.join(this.basePath, 'src', 'api');
    const corePath = path.join(projectPath, 'core');

    return [
      path.join(projectPath, 'config'),
      path.join(projectPath, 'shared'),
      path.join(corePath, 'database'),
      path.join(corePath, 'middleware'),
      path.join(corePath, 'routes', 'v1'),
      path.join(corePath, 'services'),
      path.join(corePath, 'utils'),
      path.join(corePath, 'validators'),
      path.join(corePath, 'controllers'),
      path.join(corePath, 'repositories'),
      path.join(corePath, 'models'),
    ];
  }

  /**
   * Creates a directory structure based on the specified paths.
   * Logs success or failure for each directory.
   */
  public createDirectoryStructure(): void {
    const directories = this.getDirectoryStructure();

    directories.forEach((dir) => {
      try {
        createDir(dir);
      } catch (error) {
        console.error(`Failed to create directory: ${dir}`, error);
      }
    });
  }
}
