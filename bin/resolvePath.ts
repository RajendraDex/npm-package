import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Get the global node_modules directory.
 * @returns The path to the global node_modules directory.
 */
export function getGlobalNodeModulesPath(): string {
	// Get the global installation path using npm config
	const globalPath = execSync('npm config get prefix').toString().trim();
	console.log("🚀 -------- file: resolvePath.ts:12 -------- getGlobalNodeModulesPath -------- globalPath:", globalPath);
	return path.join(globalPath, 'lib', 'node_modules');
}

/**
 * Find the path of a package in the local node_modules directory.
 * @param packageName - The name of the package to find.
 * @returns The path of the package if found, otherwise null.
 */
export async function findLocalPackage(packageName: string): Promise<string | null> {
	const localModulesPath = path.join(process.cwd(), 'node_modules', packageName);

	// Check if the package exists in the local node_modules
	if (fs.existsSync(localModulesPath)) {
		return localModulesPath;
	}

	return null;
}

/**
 * Find the path of a globally installed package.
 * @param packageName - The name of the package to find.
 * @returns The path of the package if found, otherwise null.
 */
export async function findGlobalPackage(packageName: string): Promise<string | null> {
	const globalModulesPath = await getGlobalNodeModulesPath();
	const packagePath = path.join(globalModulesPath, packageName);

	// Check if the package exists in the global node_modules
	if (fs.existsSync(packagePath)) {
		return packagePath;
	}

	return null;
}

// // Example usage
// const packageName = 'your-package-name'; // Replace with your package name

// const localPackagePath = findLocalPackage(packageName);
// if (localPackagePath) {
// 	console.log(`Local package found at: ${localPackagePath}`);
// } else {
// 	console.log('Local package not found.');
// }

// const globalPackagePath = findGlobalPackage(packageName);
// if (globalPackagePath) {
// 	console.log(`Global package found at: ${globalPackagePath}`);
// } else {
// 	console.log('Global package not found.');
// }