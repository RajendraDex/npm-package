"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const createDir = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:',
        default: 'my-node-ts-project',
        validate: (input) => {
            if (!input)
                return 'Project name cannot be empty.';
            if (input.length < 3)
                return 'Project name should be at least 3 characters long.';
            return true;
        },
        filter: (input) => input.trim(),
    },
    {
        type: 'input',
        name: 'dbName',
        message: 'Enter database name:',
        default: 'my_database',
        validate: (input) => {
            if (!input)
                return 'Database name cannot be empty.';
            if (input.length < 3)
                return 'Database name should be at least 3 characters long.';
            return true;
        },
        filter: (input) => input.trim(),
    },
    {
        type: 'list',
        name: 'dbType',
        message: 'Choose your preferred database type:',
        default: 'PostgreSQL',
        choices: [
            { name: 'MySQL', value: 'mysql' },
            { name: 'PostgreSQL', value: 'postgresql' },
            { name: 'SQLite', value: 'sqlite' },
            { name: 'MongoDB', value: 'mongodb' },
            new inquirer_1.default.Separator(),
            { name: 'Other', value: 'other' },
        ],
        validate: (input) => {
            if (!input)
                return 'You must select a database type.';
            return true;
        },
        filter: (input) => input.toLowerCase(),
    },
    {
        type: 'list',
        name: 'ormType',
        message: 'Choose ORM type:',
        default: 'TypeORM',
        choices: [
            { name: 'TypeORM', value: 'typeorm' },
            { name: 'Sequelize', value: 'sequelize' },
            { name: 'Prisma', value: 'prisma' },
            { name: 'None', value: 'none' },
        ],
        validate: (input) => {
            if (!input)
                return 'You must select an ORM type.';
            return true;
        },
        filter: (input) => input.toLowerCase(),
    },
    {
        type: 'confirm',
        name: 'useDocker',
        message: 'Would you like to use Docker for this project?',
        default: false,
    },
    {
        type: 'input',
        name: 'dockerImage',
        message: 'Enter the Docker image name (if applicable):',
        default: 'node:14',
        when: (answers) => answers.useDocker,
        validate: (input) => {
            if (!input)
                return 'Docker image name cannot be empty.';
            return true;
        },
    },
    {
        type: 'checkbox',
        name: 'additionalFeatures',
        message: 'Select additional features you want to include:',
        choices: [
            { name: 'Linting (ESLint)', value: 'eslint' },
            { name: 'Testing (Jest)', value: 'jest' },
            { name: 'Prettier for code formatting', value: 'prettier' },
            { name: 'TypeScript support', value: 'typescript' },
        ],
        validate: (input) => {
            if (input.length === 0)
                return 'You must select at least one feature.';
            return true;
        },
    },
];
const main = async () => {
    console.log(chalk_1.default.blue('Welcome to the Node.js + TypeScript project generator!'));
    try {
        const answers = await inquirer_1.default.prompt(questions);
        console.log('\nWarning: Please ensure that the database and ORM types you selected are compatible with your project requirements.');
        const { projectName, dbName, dbType, ormType } = answers;
        const projectPath = path_1.default.join(process.cwd(), projectName);
        console.log(chalk_1.default.green(`Creating project folder: ${projectName}`));
        createDir(projectPath);
        console.log(chalk_1.default.green('Setting up project...'));
        const packageJson = {
            name: projectName,
            version: '1.0.0',
            main: 'dist/index.js',
            scripts: {
                start: 'node dist/index.js',
                build: 'tsc',
            },
            dependencies: {},
            devDependencies: {
                typescript: '^4.0.0',
            },
        };
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
                target: 'ES6',
                module: 'CommonJS',
                outDir: 'dist',
                strict: true,
            },
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, '.prettierrc'), JSON.stringify({
            singleQuote: true,
            trailingComma: 'all',
            semi: true,
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, '.prettierignore'), `node_modules
		dist
		logs
		.env
		`);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, '.eslintrc.mjs'), JSON.stringify({
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, '.eslintignore'), `node_modules
		dist
		logs
		.env
		`);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'jest.config.mjs'), JSON.stringify({
            preset: 'ts-jest',
            testEnvironment: 'node',
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'Dockerfile'), `FROM node:22

			WORKDIR /app

			COPY package.json .

			RUN npm install

			COPY . .

			CMD ["npm", "start"]
			`);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'jest.config.mjs'), JSON.stringify({
            preset: 'ts-jest',
            testEnvironment: 'node',
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, '.gitignore'), `node_modules
		dist
		logs
		.env
		`);
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'docker-compose.yml'), JSON.stringify({
            services: {
                app: {
                    image: '${dockerImage}',
                },
            },
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'ecosystem.config.js'), JSON.stringify({
            apps: [
                {
                    name: '${projectName}',
                    script: 'dist/index.js',
                },
            ],
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'nodemon.json'), JSON.stringify({
            watch: ['src/**/*.ts'],
            ext: 'ts',
            exec: 'ts-node src/index.ts',
        }, null, 2));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'nvmrc'), JSON.stringify({
            node: '22.x',
        }, null, 2));
        createDir(path_1.default.join(projectPath, 'src'));
        fs_1.default.writeFileSync(path_1.default.join(projectPath, 'src', 'index.ts'), `console.log('Hello, ${projectName}! Database: ${dbName} (${dbType}) using ${ormType} ORM');`);
        console.log(chalk_1.default.green('Installing dependencies...'));
        (0, child_process_1.execSync)('npm install', { cwd: projectPath, stdio: 'inherit' });
        console.log(chalk_1.default.blue('Project setup complete!'));
        console.log(chalk_1.default.yellow(`Navigate to your project: cd ${projectName}`));
        console.log(chalk_1.default.yellow('Run "npm run build" to build the project.'));
        console.log(chalk_1.default.yellow('Run "npm start" to start the project.'));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red('Error:', error.message));
        }
        else {
            console.error(chalk_1.default.red('An unknown error occurred'));
        }
        process.exit(1);
    }
};
main().catch((err) => {
    if (err instanceof Error) {
        console.error(chalk_1.default.red('Error:', err.message));
    }
    else {
        console.error(chalk_1.default.red('An unknown error occurred'));
    }
    process.exit(1);
});
//# sourceMappingURL=example.js.map