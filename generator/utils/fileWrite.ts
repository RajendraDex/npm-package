// utils/writeFile.ts
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { createDir } from './createDir';

/**
 * Write content to a file, ensuring the directory exists.
 * @param filePath - The path of the file to write.
 * @param content - The content to write to the file.
 * @returns A promise that resolves when the file is successfully written.
 */
export const writeFile = async (filePath: string, content: string): Promise<void> => {
  try {
    const dirPath = dirname(filePath);
    await createDir(dirPath); // Ensure the directory exists
    await fs.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error writing file at ${filePath}: ${(error as Error).message}`);
    throw error;
  }
};
