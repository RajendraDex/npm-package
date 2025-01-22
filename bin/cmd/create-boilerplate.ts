import "module-alias/register"
import FsExt from "fs-extra"
import Path, { dirname } from "path"


interface PackageJson {
	[key: string]: any
	name: string
	dependencies?: { [key: string]: string }
	devDependencies?: { [key: string]: string }
	scripts?: { [key: string]: string }
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

const PkgFieldsToKeep = ["type", "main", "types", "scripts", "dependencies", "devDependencies"]

const DepsToIgnore = ["fs-extra", "@types/fs-extra", "standard-release"]

export class NodeJSStarterKit {
	private readonly __dirname: string
	private readonly FilesToIgnore: string[]
	private readonly DepsToIgnore: string[]
	private readonly Templates: { file: string; copyTo: string }[]
	private readonly PkgFieldsToKeep: string[]

	constructor(private readonly projectName: string, private readonly projectPath: string) {
		this.__dirname = Path.resolve()
		this.FilesToIgnore = FilesToIgnore;
		this.DepsToIgnore = DepsToIgnore
		this.Templates = Templates;
		this.PkgFieldsToKeep = PkgFieldsToKeep;
		this.projectName = projectName;
		this.projectPath = projectPath;
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

		const source = this.makePath(this.__dirname, ".")

		// ! This is woking fine only if the project is in the root directory
		const des = this.makePath(this.__dirname, "../")
		const dest1 = this.paramOr(args, "destination", des).trim()
		const destination = this.makePath(dest1, this.projectName)

		// ! This is woking fine only if the project is in the root directory
		// const dest = this.paramOr(args, "destination", process.cwd()).trim()
		// const destination = this.makePath(dest, this.projectName)
		const app = this.paramOr(args, "name", this.projectName).trim()

		//* Check if destination is a subdirectory of source
		if (destination.startsWith(source)) {
			throw new Error(`Cannot copy from '${source}' to a subdirectory of itself: '${destination}'`);
		}

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
				newPkg[field] = pkg[field]
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

