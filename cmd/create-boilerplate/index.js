#!/usr/bin/env node

import FsExt from 'fs-extra'
import Path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const paramOr = (map, arg, def) => map.get(arg) || def
const makePath = (...p) => Path.join(...p)
const ignoreContent =
	(...values) =>
		source =>
			!values.some(x => source === x)

const FilesToIgnore = [
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
	'LICENSE',
	'README.md',
	'package.json',
	'package-lock.json',
	'yarn.lock',
	'tsconfig.build.tsbuildinfo',

	// ! implemeted
	"boilerplate",
	"generator",
	"bin",
	"dist",
	"example",
	"src-rajenddra",
	"log"
]

const DepsToIgnore = ['fs-extra', '@types/fs-extra', 'standard-release']

const Templates = [
	{ file: 'ci.yml', copyTo: '.github/workflows/ci.yml' },
	{ file: 'README.md', copyTo: 'README.md' },
	{ file: '.gitignore.husky', copyTo: '.husky/.gitignore' },
	{ file: '.gitignore.root', copyTo: '.gitignore' },
	{ file: '.dockerignore.root', copyTo: '.dockerignore' },
	{ file: "tsconfig.json.root", copyTo: "tsconfig.json" },
	{ file: "jest.config.root", copyTo: "jest.config.js" },
	{ file: ".env.example.root", copyTo: ".env.example" },
	{ file: "package.json.root", copyTo: "package.json" },
]

const PkgFieldsToKeep = ['type', 'main', 'types', 'scripts', '_moduleAliases', 'dependencies', 'devDependencies']

function main() {
	console.log('NodeJS Starter Kit - Bootstrapping New Project')

	const argv = process.argv.slice(2)
	const args = new Map()

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i]

		if (/^--.+=/.test(arg)) {
			const match = arg.match(/^--([^=]+)=([\s\S]*)$/)
			const key = match[1]
			const value = match[2]

			args.set(key, value)
		} else if (/^--.+/.test(arg)) {
			const key = arg.match(/^--(.+)/)[1]
			const next = argv[i + 1]

			args.set(key, next)
		}
	}

	const source = makePath(__dirname, '../..')
	const dest = paramOr(args, 'destination', process.cwd()).trim()
	const app = paramOr(args, 'name', 'my-app').trim()
	const destination = makePath(dest, app)

	console.log(
		`
Summary:
Destination: ${destination}
App: ${app}
`,
	)

	console.log('Copying Project Files ...')

	FsExt.copySync(source, destination, { filter: ignoreContent(...FilesToIgnore.map(x => makePath(source, x))) })

	console.log('Copying Templates ...')

	for (const x of Templates) {
		FsExt.copySync(makePath(source, 'templates', x.file), makePath(destination, x.copyTo))
	}

	console.log('Preparing package.json ...')

	const pkg = FsExt.readJsonSync(makePath(source, 'package.json'))
	const newPkg = {
		name: app,
	}

	for (const field of PkgFieldsToKeep) {
		if (typeof pkg[field] !== 'undefined') {
			newPkg[field] = pkg[field]
		}
	}

	for (const dep of DepsToIgnore) {
		if (newPkg.dependencies[dep]) {
			delete newPkg.dependencies[dep]
		}

		if (newPkg.devDependencies[dep]) {
			delete newPkg.devDependencies[dep]
		}
	}
	//! This scripts are for the boilerplate
	newPkg.scripts = {
		"build": "npm run clean && tsc",
		"start": "node dist/app.bootstrap",
		"dev": "npm run build && npm run start",
		"clean": "rm -rf dist",
		"lint": "eslint .",
		"format": "prettier --write ."
	}
	delete newPkg.scripts.release

	FsExt.writeJsonSync(makePath(destination, 'package.json'), newPkg, { spaces: 2 })

	console.log('\nDone!')

	return Promise.resolve()
}

await main()



// TODO: alternative way to run this file
// #!/usr/bin/env node

// import FsExt from 'fs-extra';
// import Path, { dirname } from 'path';
// import { fileURLToPath } from 'url';
// import { exec } from 'child_process';

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const paramOr = (map, arg, def) => map.get(arg) || def;
// const makePath = (...p) => Path.join(...p);
// const ignoreContent =
//   (...values) =>
//   source =>
//     !values.some(x => source === x);

// const FilesToIgnore = [
//   '.git',
//   '.idea',
//   '.vscode',
//   '.github',
//   '.husky/_',
//   '.yarn',
//   '.yarn/cache',
//   '.yarn/build-state.yml',
//   '.yarn/install-state.gz',
//   '.yarnrc.yml',
//   '.versionrc.js',
//   'cmd',
//   'coverage',
//   'dist',
//   'docs',
//   'node_modules',
//   'scripts',
//   'templates',
//   'tools',
//   '.codeclimate.yml',
//   '.npmignore',
//   '.env',
//   'CONTRIBUTING.md',
//   'CHANGELOG.md',
//   'CODE_OF_CONDUCT.md',
//   'LICENSE',
//   'README.md',
//   'package.json',
//   'package-lock.json',
//   'yarn.lock',
//   'tsconfig.build.tsbuildinfo',
// ];

// const DepsToIgnore = ['fs-extra', '@types/fs-extra', 'standard-release'];

// const Templates = [
//   { file: 'ci.yml', copyTo: '.github/workflows/ci.yml' },
//   { file: 'README.md', copyTo: 'README.md' },
//   { file: '.gitignore.husky', copyTo: '.husky/.gitignore' },
//   { file: '.gitignore.root', copyTo: '.gitignore' },
//   { file: '.dockerignore.root', copyTo: '.dockerignore' },
// ];

// const PkgFieldsToKeep = ['type', 'main', 'types', 'scripts', 'dependencies', 'devDependencies'];

// function checkDependencies() {
//   const requiredPackages = ['fs-extra']; // Add any other required packages here
//   const missingPackages = [];

//   requiredPackages.forEach(pkg => {
//     try {
//       require.resolve(pkg);
//     } catch (e) {
//       missingPackages.push(pkg);
//     }
//   });

//   if (missingPackages.length > 0) {
//     console.log(`The following packages are missing: ${missingPackages.join(', ')}`);
//     console.log('Installing missing packages...');
//     exec(`npm install ${missingPackages.join(' ')}`, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error installing packages: ${stderr}`);
//         return;
//       }
//       console.log(`Successfully installed: ${missingPackages.join(', ')}`);
//       main(); // Call main function after installation
//     });
//   } else {
//     main(); // Call main function if no packages are missing
//   }
// }

// function main() {
//   console.log('NodeJS Starter Kit - Bootstrapping New Project');

//   const argv = process.argv.slice(2);
//   const args = new Map();

//   for (let i = 0; i < argv.length; i++) {
//     const arg = argv[i];

//     if (/^--.+=/.test(arg)) {
//       const match = arg.match(/^--([^=]+)=([\s\S]*)$/);
//       const key = match[1];
//       const value = match[2];

//       args.set(key, value);
//     } else if (/^--.+/.test(arg)) {
//       const key = arg.match(/^--(.+)/)[1];
//       const next = argv[i + 1];

//       args.set(key, next);
//     }
//   }

//   const source = makePath(__dirname, '../..');
//   const dest = paramOr(args, 'destination', process.cwd()).trim();
//   const app = paramOr(args, 'name', 'my-app').trim();
//   const destination = makePath(dest, app);

//   console.log(
//     `
// Summary:
// Destination: ${destination}
// App: ${app}
// `
//   );

//   console.log('Copying Project Files ...');

//   FsExt.copySync(source, destination, { filter: ignoreContent(...FilesToIgnore.map(x => makePath(source, x))) });

//   console.log('Copying Templates ...');

//   for (const x of Templates) {
//     FsExt.copySync(makePath(source, 'templates', x.file), makePath(destination, x.copyTo));
//   }

//   console.log('Preparing package.json ...');

//   const pkg = FsExt.readJsonSync(makePath(source, 'package.json'));
//   const newPkg = {
//     name: app,
//   };

//   for (const field of PkgFieldsToKeep) {
//     if (typeof pkg[field] !== 'undefined') {
//       newPkg[field] = pkg[field];
//     }
//   }

//   for (const dep of DepsToIgnore) {
//     if (newPkg.dependencies[dep]) {
//       delete newPkg.dependencies[dep];
//     }

//     if (newPkg.devDependencies[dep]) {
//       delete newPkg.devDependencies[dep];
//     }
//   }

//   delete newPkg.scripts.release;

//   FsExt.writeJsonSync(makePath(destination, 'package.json'), newPkg, { spaces: 2 });

//   console.log('\nDone!');

//   return Promise.resolve();
// }

// // Start the process
// checkDependencies();