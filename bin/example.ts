import 'module-alias/register';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';

// Helper to create a directory
const createDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Define the interface for our answers
interface ProjectAnswers {
  projectName: string;
  dbName: string;
  dbType: 'MySQL' | 'PostgreSQL' | 'SQLite' | 'MongoDB';
  ormType: 'TypeORM' | 'Sequelize' | 'Prisma' | 'None';
}

const questions = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Enter project name:',
    default: 'my-node-ts-project',
    validate: (input: string) => {
      if (!input) return 'Project name cannot be empty.';
      if (input.length < 3) return 'Project name should be at least 3 characters long.';
      return true;
    },
    filter: (input: string) => input.trim(), // Trim whitespace
  },
  {
    type: 'input',
    name: 'dbName',
    message: 'Enter database name:',
    default: 'my_database',
    validate: (input: string) => {
      if (!input) return 'Database name cannot be empty.';
      if (input.length < 3) return 'Database name should be at least 3 characters long.';
      return true;
    },
    filter: (input: string) => input.trim(), // Trim whitespace
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
      new inquirer.Separator(),
      { name: 'Other', value: 'other' },
    ],
    validate: (input: string) => {
      if (!input) return 'You must select a database type.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
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
    validate: (input: string) => {
      if (!input) return 'You must select an ORM type.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
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
    when: (answers: any) => answers.useDocker, // Only ask if the user wants to use Docker
    validate: (input: string) => {
      if (!input) return 'Docker image name cannot be empty.';
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
    validate: (input: string) => {
      if (input.length === 0) return 'You must select at least one feature.';
      return true;
    },
  },
] as const;

// Main function
const main = async () => {
  console.log(chalk.blue('Welcome to the Node.js + TypeScript project generator!'));

  try {
    // Collect user inputs with proper typing
    const answers = await inquirer.prompt(questions as any);

    // Optional: Display a warning after collecting inputs
    // console.log(
    //   '\nWarning: Please ensure that the database and ORM types you selected are compatible with your project requirements.',
    // );

    const { projectName, dbName, dbType, ormType } = answers;
    const projectPath = path.join(process.cwd(), projectName);

    // Step 1: Create project folder
    console.log(chalk.green(`Creating project folder: ${projectName}`));
    createDir(projectPath);

    // Step 2: Initialize project with TypeScript and setup files
    console.log(chalk.green('Setting up project...'));
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

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    fs.writeFileSync(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ES6',
            module: 'CommonJS',
            outDir: 'dist',
            strict: true,
          },
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, '.prettierrc'),
      JSON.stringify(
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: true,
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, '.prettierignore'),
      `node_modules
		dist
		logs
		.env
		`,
    );

    fs.writeFileSync(
      path.join(projectPath, '.eslintrc.mjs'),
      JSON.stringify(
        {
          extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
          },
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, '.eslintignore'),
      `node_modules
		dist
		logs
		.env
		`,
    );

    fs.writeFileSync(
      path.join(projectPath, 'jest.config.mjs'),
      JSON.stringify(
        {
          preset: 'ts-jest',
          testEnvironment: 'node',
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, 'Dockerfile'),
      `FROM node:22

			WORKDIR /app

			COPY package.json .

			RUN npm install

			COPY . .

			CMD ["npm", "start"]
			`,
    );

    fs.writeFileSync(
      path.join(projectPath, 'jest.config.mjs'),
      JSON.stringify(
        {
          preset: 'ts-jest',
          testEnvironment: 'node',
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, '.gitignore'),
      `node_modules
		dist
		logs
		.env
		`,
    );

    fs.writeFileSync(
      path.join(projectPath, 'docker-compose.yml'),
      JSON.stringify(
        {
          services: {
            app: {
              image: '${dockerImage}',
            },
          },
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, 'ecosystem.config.js'),
      JSON.stringify(
        {
          apps: [
            {
              name: '${projectName}',
              script: 'dist/index.js',
            },
          ],
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, 'nodemon.json'),
      JSON.stringify(
        {
          watch: ['src/**/*.ts'],
          ext: 'ts',
          exec: 'ts-node src/index.ts',
        },
        null,
        2,
      ),
    );

    fs.writeFileSync(
      path.join(projectPath, 'nvmrc'),
      JSON.stringify(
        {
          node: '22.x',
        },
        null,
        2,
      ),
    );

    createDir(path.join(projectPath, 'src'));
    fs.writeFileSync(
      path.join(projectPath, 'src', 'index.ts'),
      `console.log('Hello, ${projectName}! Database: ${dbName} (${dbType}) using ${ormType} ORM');`,
    );

    // Step 3: Install dependencies
    console.log(chalk.green('Installing dependencies...'));
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

    // Step 4: Provide final instructions
    console.log(chalk.blue('Project setup complete!'));
    console.log(chalk.yellow(`Navigate to your project: cd ${projectName}`));
    console.log(chalk.yellow('Run "npm run build" to build the project.'));
    console.log(chalk.yellow('Run "npm start" to start the project.'));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(chalk.red('Error:', error.message));
    } else {
      console.error(chalk.red('An unknown error occurred'));
    }
    process.exit(1);
  }
};

// Call main with proper error handling
main().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(chalk.red('Error:', err.message));
  } else {
    console.error(chalk.red('An unknown error occurred'));
  }
  process.exit(1);
});
