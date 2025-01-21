#!/usr/bin/env node

import FsExt from "fs-extra"
import Path, { dirname } from "path"
import { fileURLToPath } from "url"

// const __dirname = dirname(fileURLToPath(import.meta.url)) // TODO: need to implement this
const __dirname = Path.resolve()


const paramOr = (map: Map<string, string>, arg: string, def: string): string => map.get(arg) || def
const makePath = (...p: string[]): string => Path.join(...p)
const ignoreContent =
	(...values: string[]) =>
		(source: string): boolean =>
			!values.some((x) => source === x)

const FilesToIgnore: string[] = [
	".git",
	".idea",
	".vscode",
	".github",
	".husky/_",
	".yarn",
	".yarn/cache",
	".yarn/build-state.yml",
	".yarn/install-state.gz",
	".yarnrc.yml",
	".versionrc.js",
	"cmd",
	"coverage",
	"dist",
	"docs",
	"node_modules",
	"scripts",
	"templates",
	"tools",
	".codeclimate.yml",
	".npmignore",
	".env",
	"CONTRIBUTING.md",
	"CHANGELOG.md",
	"CODE_OF_CONDUCT.md",
	"LICENSE",
	"README.md",
	"package.json",
	"package-lock.json",
	"yarn.lock",
	"tsconfig.build.tsbuildinfo",
]

const DepsToIgnore: string[] = ["fs-extra", "@types/fs-extra", "standard-release"]

interface Template {
	file: string
	copyTo: string
}

const Templates: Template[] = [
	// { file: "ci.yml", copyTo: ".github/workflows/ci.yml" },
	// { file: "README.md", copyTo: "README.md" },
	// { file: ".gitignore.husky", copyTo: ".husky/.gitignore" },
	// { file: ".gitignore.root", copyTo: ".gitignore" },
	// { file: ".dockerignore.root", copyTo: ".dockerignore" },
]

const PkgFieldsToKeep: string[] = ["type", "main", "types", "scripts", "dependencies", "devDependencies"]

interface PackageJson {
	[key: string]: any
	name: string
	dependencies?: { [key: string]: string }
	devDependencies?: { [key: string]: string }
	scripts?: { [key: string]: string }
}

async function main(): Promise<void> {
	console.log("NodeJS Starter Kit - Bootstrapping New Project")

	console.log("🚀 -------- file: create-boilerplate.ts:80 -------- main -------- process.argv:", process.argv);
	const argv = process.argv.slice(2)
	const args = new Map<string, string>()

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]

		if (/^--.+=/.test(arg)) {
			const match = arg.match(/^--([^=]+)=([\s\S]*)$/)
			if (match) {
				const [, key, value] = match
				args.set(key, value)
			}
		} else if (/^--.+/.test(arg)) {
			const match = arg.match(/^--(.+)/)
			if (match) {
				const [, key] = match
				const next = argv[i + 1]
				args.set(key, next)
			}
		}
	}

	// ... existing code ...
	const source = makePath(__dirname, "../../..") // Updated to point to the root directory
	// ... existing code ...
	// const source = makePath(__dirname, "../..")
	const dest = paramOr(args, "destination", process.cwd()).trim()
	const app = paramOr(args, "name", "my-app").trim()
	const destination = makePath(dest, app)

	console.log(`
Summary:
Destination: ${destination}
App: ${app}
`)

	console.log("Copying Project Files ...")

	FsExt.copySync(source, destination, { filter: ignoreContent(...FilesToIgnore.map((x) => makePath(source, x))) })

	console.log("Copying Templates ...")

	for (const x of Templates) {
		FsExt.copySync(makePath(source, "templates", x.file), makePath(destination, x.copyTo))
	}

	console.log("Preparing package.json ...")

	const pkg: PackageJson = FsExt.readJsonSync(makePath(source, "package.json"))
	const newPkg: PackageJson = {
		name: app,
	}

	for (const field of PkgFieldsToKeep) {
		if (typeof pkg[field] !== "undefined") {
			newPkg[field] = pkg[field]
		}
	}

	for (const dep of DepsToIgnore) {
		if (newPkg.dependencies && newPkg.dependencies[dep]) {
			delete newPkg.dependencies[dep]
		}

		if (newPkg.devDependencies && newPkg.devDependencies[dep]) {
			delete newPkg.devDependencies[dep]
		}
	}

	if (newPkg.scripts) {
		delete newPkg.scripts.release
	}

	FsExt.writeJsonSync(makePath(destination, "package.json"), newPkg, { spaces: 2 })

	console.log("\nDone!")
}

main().catch(console.error)
