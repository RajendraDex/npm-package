"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
exports.questions = [
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
            { name: 'Mongoose', value: 'mongoose' },
            { name: 'Knexjs', value: 'knex' },
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
        default: 'node:22',
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
            { name: 'Package.json', value: 'package.json' },
            { name: 'tsconfig.json', value: 'tsconfig.json' },
            { name: '.eslintrc.json', value: '.eslintrc.json' },
            { name: '.prettierrc', value: '.prettierrc' },
            { name: '.prettierignore', value: '.prettierignore' },
            { name: '.editorconfig', value: '.editorconfig' },
            { name: '.gitattributes', value: '.gitattributes' },
            { name: '.gitignore', value: '.gitignore' },
            { name: 'PM2 Config', value: 'ecosystem.config.js' },
            { name: 'README.md', value: 'README.md' },
            { name: '.nvmrc', value: '.nvmrc' },
            { name: '.vscode/settings.json', value: '.vscode/settings.json' },
            { name: '.env', value: '.env' },
            { name: '.env.example', value: '.env.example' },
        ],
        validate: (input) => {
            if (input.length === 0)
                return 'You must select at least one feature.';
            return true;
        },
    },
];
//# sourceMappingURL=index.js.map