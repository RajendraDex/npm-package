import inquirer from 'inquirer';

export const questions = [
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
      // { name: 'SQLite', value: 'sqlite' },
      // { name: 'MongoDB', value: 'mongodb' },
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
      // { name: 'Sequelize', value: 'sequelize' },
      // { name: 'Prisma', value: 'prisma' },
      // { name: 'Mongoose', value: 'mongoose' },
      { name: 'Knexjs', value: 'knex' },
      { name: 'None', value: 'none' },
    ],
    validate: (input: string) => {
      if (!input) return 'You must select an ORM type.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
  },
  {
    type: 'list',
    name: 'copyFrom',
    message: 'Choose boilerplate source:',
    default: 'public-repo',
    choices: [
      { name: 'Public Repo', value: 'public-repo' },
      { name: 'Private Repo', value: 'private-repo' },
      { name: 'Copy Directory', value: 'copy-directory' },
      { name: 'Write File', value: 'write-file' },
    ],
    validate: (input: string) => {
      if (!input) return 'You must select a boilerplate source.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
  },
  // {
  //   type: 'confirm',
  //   name: 'useDocker',
  //   message: 'Would you like to use Docker for this project?',
  //   default: false,
  // },
  // {
  //   type: 'input',
  //   name: 'dockerImage',
  //   message: 'Enter the Docker image name (if applicable):',
  //   default: 'node:22',
  //   when: (answers: any) => answers.useDocker, // Only ask if the user wants to use Docker
  //   validate: (input: string) => {
  //     if (!input) return 'Docker image name cannot be empty.';
  //     return true;
  //   },
  // },
  // {
  //   type: 'checkbox',
  //   name: 'additionalFeatures',
  //   message: 'Select additional features you want to include:',
  //   choices: [
  //     // These two file should be added by default
  //     // { name: 'tsconfig.json', value: 'tsconfig.json' },
  //     // { name: 'Package.json', value: 'package.json' },

  //     { name: '.eslintrc.json', value: '.eslintrc.json' },
  //     { name: 'Linting (ESLint)', value: 'eslint' },
  //     { name: 'Testing (Jest)', value: 'jest' },
  //     { name: 'Prettier for code formatting', value: 'prettier' },
  //     { name: 'TypeScript support', value: 'typescript' },
  //     { name: '.prettierrc', value: '.prettierrc' },
  //     { name: '.prettierignore', value: '.prettierignore' },
  //     { name: '.editorconfig', value: '.editorconfig' },
  //     { name: '.gitattributes', value: '.gitattributes' },
  //     { name: '.gitignore', value: '.gitignore' },
  //     { name: 'PM2 Config', value: 'ecosystem.config.js' },
  //     { name: 'README.md', value: 'README.md' },
  //     { name: '.nvmrc', value: '.nvmrc' },
  //     { name: '.vscode/settings.json', value: '.vscode/settings.json' },
  //     { name: '.env', value: '.env' },
  //     { name: '.env.example', value: '.env.example' },
  //     { name: 'License', value: 'license' },
  //   ],
  //   validate: (input: string) => {
  //     if (input.length === 0) return 'You must select at least one feature.';
  //     return true;
  //   },
  // },
] as const;
