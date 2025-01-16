import { promises as fs } from 'fs';

/**
 * Create a directory if it doesn't exist.
 * @param dirPath - The path of the directory to create.
 * @returns A promise that resolves when the directory is created or already exists.
 */
export const createDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory created or already exists: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory at ${dirPath}: ${(error as Error).message}`);
    throw error;
  }
};
