import FsExt from 'fs-extra';
import Path from 'path';
import { PackageJsonFileCreator } from './cmd/PackageJsonGenerator';
import { EnvCreator } from './cmd/EnvFileCreator';
import { Answers } from './cmd/answer.interface';

type Template = { file: string; copyTo: string };
type PackageJson = Record<string, any>;

export class CreateBoilerplate {
	private __dirname: string;

	private static FilesToIgnore: string[] = [
		'.git',
		'.idea',
		'.vscode',
		'.github',
		'.husky/_',
		'.yarn',
		'.yarn/cache',
		'.yarn/build-state.yml',
		'.yarn/install-state.gz',
		'.yarnrc.yml',
		'.versionrc.js',
		'cmd',
		'coverage',
		'dist',
		'docs',
		'node_modules',
		'scripts',
		'templates',
		'tools',
		'.codeclimate.yml',
		'.npmignore',
		'.env',
		'CONTRIBUTING.md',
		'CHANGELOG.md',
		'CODE_OF_CONDUCT.md',
		'LICENSE', 'README.md',
		'package.json',
		'package-lock.json',
		'yarn.lock',
		'tsconfig.build.tsbuildinfo',
		"boilerplate",
		"generator",
		"bin",
		"dist",
		"example",
		"src-rajenddra"

	];

	private static DepsToIgnore: string[] = [
		'fs-extra', '@types/fs-extra', 'standard-release',
	];

	private static Templates: Template[] = [
		{ file: 'ci.yml', copyTo: '.github/workflows/ci.yml' },
		{ file: 'README.md', copyTo: 'README.md' },
		{ file: '.gitignore.husky', copyTo: '.husky/.gitignore' },
		{ file: '.gitignore.root', copyTo: '.gitignore' },
		{ file: '.dockerignore.root', copyTo: '.dockerignore' },
		{ file: "tsconfig.json.root", copyTo: "tsconfig.json" },
		{ file: "jest.config.root", copyTo: "jest.config.js" },
		{ file: ".env.example.root", copyTo: ".env.example" },
		{ file: "package.json.root", copyTo: "package1.json" },

	];

	private static PkgFieldsToKeep: string[] = [
		'type', 'main', 'types', 'scripts', 'dependencies', 'devDependencies',
	];

	private projectName: string;
	private destination: string;
	private answers: Answers;
	private dbType: string;
	private ormType: string;

	constructor(projectName: string, destination: string, answers: Answers) {
		this.projectName = projectName;
		this.destination = destination;
		this.answers = answers;
		this.dbType = answers.dbType as string;
		this.ormType = answers.ormType as string;
		this.__dirname = Path.resolve();
	}

	private paramOr(map: Map<string, string>, arg: string, def: string): string {
		return map.get(arg) || def;
	}

	private makePath(...p: string[]): string {
		return Path.join(...p);
	}

	private ignoreContent(...values: string[]) {
		return (source: string): boolean => !values.some((x) => source === x);
	}

	public async createBoilerplate(): Promise<void> {
		console.log('NodeJS Starter Kit - Bootstrapping New Project');

		const argv = process.argv.slice(2);
		const args = new Map<string, string>();

		for (let i = 0; i < argv.length; i++) {
			const arg = argv[i];
			if (/^--.+=/.test(arg)) {
				const match = arg.match(/^--([^=]+)=([\s\S]*)$/);
				if (match) args.set(match[1], match[2]);
			} else if (/^--.+/.test(arg)) {
				const key = arg.match(/^--(.+)/)?.[1];
				const next = argv[i + 1];
				if (key) args.set(key, next);
			}
		}

		const source = this.makePath(__dirname, '../..');

		const dest = this.paramOr(args, 'destination', process.cwd()).trim();
		const app = this.paramOr(args, 'name', this.projectName).trim();
		const destination = this.makePath(dest, app);

		console.log(`
			Summary:
			- Destination: ${destination}
			- Source: ${source}
			- App: ${app}
		`)

		console.log('Copying Project Files ...');
		FsExt.copySync(source, destination, {
			filter: this.ignoreContent(...CreateBoilerplate.FilesToIgnore.map((x) => this.makePath(source, x))),
		});

		console.log('Copying Templates ...');
		for (const x of CreateBoilerplate.Templates) {
			FsExt.copySync(this.makePath(source, 'templates', x.file), this.makePath(destination, x.copyTo));
		}

		// TODO: This need to implement dynamically
		// console.log('Preparing package.json ...');
		// const pkg: PackageJson = FsExt.readJsonSync(this.makePath(source, 'package.json'));
		// const newPkg: PackageJson = { name: app };

		// for (const field of CreateBoilerplate.PkgFieldsToKeep) {
		// 	if (typeof pkg[field] !== 'undefined') {
		// 		newPkg[field] = pkg[field];
		// 	}
		// }

		// for (const dep of CreateBoilerplate.DepsToIgnore) {
		// 	if (newPkg.dependencies?.[dep]) delete newPkg.dependencies[dep];
		// 	if (newPkg.devDependencies?.[dep]) delete newPkg.devDependencies[dep];
		// }

		// delete newPkg.scripts?.release;

		// FsExt.writeJsonSync(this.makePath(destination, 'package.json'), newPkg, { spaces: 2 });

		// * Create package.json file dynamically
		const packageJsonPath = this.makePath(destination, 'package.json')
		const packageJson: PackageJson = await PackageJsonFileCreator
			.init(app, this.dbType, this.ormType, packageJsonPath)
			.generatePackageJson();
		FsExt.writeJsonSync(this.makePath(destination, 'package.json'), packageJson, { spaces: 2 });

		//* Create .env file dynamically
		const envFilePath = this.makePath(destination, '.env')
		const envFileContent = await EnvCreator.createEnvFile(this.answers);
		FsExt.writeFileSync(envFilePath, envFileContent);

		console.log("\n🎉👍🔥🎆🎇Done!")
	}
}
