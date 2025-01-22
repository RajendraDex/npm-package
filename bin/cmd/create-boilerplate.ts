#!/usr/bin/env node

import "module-alias/register";
import FsExt from "fs-extra"
import Path, { dirname } from "path"
import { fileURLToPath } from 'url'


interface PackageJson {
	[key: string]: any
	name: string
	dependencies?: { [key: string]: string }
	devDependencies?: { [key: string]: string }
	scripts?: { [key: string]: string }
	_moduleAliases?: { [key: string]: string }
}

const Templates = [
	{ file: "ci.yml", copyTo: ".github/workflows/ci.yml" },
	{ file: "README.md", copyTo: "README.md" },
	{ file: ".gitignore.husky", copyTo: ".husky/.gitignore" },
	{ file: ".gitignore.root", copyTo: ".gitignore" },
	{ file: ".dockerignore.root", copyTo: ".dockerignore" },
];

const FilesToIgnore = [
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

	// ! implemeted
	"boilerplate",
	"generator",
	"bin",
	"dist",
	"example"
];

const PkgFieldsToKeep = ["type", "main", "types", "_moduleAliases", "scripts", "dependencies", "devDependencies"]

const DepsToIgnore = ["fs-extra", "@types/fs-extra", "standard-release"]

export class NodeJSStarterKit {
	private readonly __dirname: string
	private readonly FilesToIgnore: string[]
	private readonly DepsToIgnore: string[]
	private readonly Templates: { file: string; copyTo: string }[]
	private readonly PkgFieldsToKeep: string[]
	private readonly projectName: string
	private readonly projectPath: string


	constructor() {
		// this.__dirname = dirname(Path.resolve())
		// this.__dirname = Path.resolve(__dirname);
		this.__dirname = dirname(__filename);

		// this.__dirname = dirname(fileURLToPath(import.meta.url))
		this.FilesToIgnore = FilesToIgnore;
		this.DepsToIgnore = DepsToIgnore
		this.Templates = Templates;
		this.PkgFieldsToKeep = PkgFieldsToKeep;
		this.projectName = 'test-app';
		this.projectPath = 'test-app';
	}

	private paramOr(map: Map<string, string>, arg: string, def: string): string {
		return map.get(arg) || def
	}

	private makePath(...p: string[]): string {
		return Path.join(...p)
	}

	private ignoreContent(...values: string[]) {
		return (source: string): boolean => !values.some((x) => source === x)
	}

	private async main(): Promise<void> {
		console.log("NodeJS Starter Kit - Bootstrapping New Project")

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

		const source = this.makePath(this.__dirname, "../../..")

		// ! This is woking fine only if the project is in the root directory
		const dest = this.paramOr(args, "destination", process.cwd()).trim()
		const app = this.paramOr(args, "name", this.projectName).trim()
		const destination = this.makePath(dest, app)

		console.log(`
			Summary:
			- Destination: ${destination}
			- Source: ${source}
			- App: ${app}
		`)

		console.log("Copying Project Files ...")

		FsExt.copySync(source, destination, {
			filter: this.ignoreContent(...this.FilesToIgnore.map((x) => this.makePath(source, x))),
		})

		console.log("Copying Templates ...")

		for (const x of this.Templates) {
			FsExt.copySync(this.makePath(source, "templates", x.file), this.makePath(destination, x.copyTo))
		}

		console.log("Preparing package.json ...")

		const pkg: PackageJson = FsExt.readJsonSync(this.makePath(source, "package.json"))
		const newPkg: PackageJson = {
			name: app,
		}

		for (const field of this.PkgFieldsToKeep) {
			if (typeof pkg[field] !== "undefined") {
				if (field === "scripts") {
					newPkg[field] = pkg[field]
				} else {
					newPkg[field] = {
						"build": "npm run clean && tsc",
						"start": "node dist/app.bootstrap",
						"dev": "npm run build && npm run start",
						"clean": "rm -rf dist",
						"lint": "eslint .",
						"format": "prettier --write ."
					}
				}
			}
		}

		for (const dep of this.DepsToIgnore) {
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

		FsExt.writeJsonSync(this.makePath(destination, "package.json"), newPkg, { spaces: 2 })

		console.log("\nDone!")
	}

	public async run(): Promise<void> {
		await this.main()
	}
}


const starterKit = new NodeJSStarterKit();
starterKit.run().then(() => {
	console.log("🎉👍🔥🎆🎇Done!")
}).catch((err) => {
	console.log(err)
})
