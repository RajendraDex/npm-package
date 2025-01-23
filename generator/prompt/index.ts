import inquirer from 'inquirer';

// export const questions = [
//   {
//     type: 'input',
//     name: 'projectName',
//     message: 'Enter project name:',
//     default: 'my-node-ts-project',
//     validate: (input: string) => {
//       if (!input) return 'Project name cannot be empty.';
//       if (input.length < 3) return 'Project name should be at least 3 characters long.';
//       return true;
//     },
//     filter: (input: string) => input.trim(), // Trim whitespace
//   },
//   {
//     type: 'input',
//     name: 'dbName',
//     message: 'Enter database name:',
//     default: 'my_database',
//     validate: (input: string) => {
//       if (!input) return 'Database name cannot be empty.';
//       if (input.length < 3) return 'Database name should be at least 3 characters long.';
//       return true;
//     },
//     filter: (input: string) => input.trim(), // Trim whitespace
//   },
//   {
//     type: 'list',
//     name: 'dbType',
//     message: 'Choose your preferred database type:',
//     default: 'PostgreSQL',
//     choices: [
//       { name: 'MySQL', value: 'mysql' },
//       { name: 'PostgreSQL', value: 'postgresql' },
//       // { name: 'SQLite', value: 'sqlite' },
//       // { name: 'MongoDB', value: 'mongodb' },
//       new inquirer.Separator(),
//       { name: 'Other', value: 'other' },
//     ],
//     validate: (input: string) => {
//       if (!input) return 'You must select a database type.';
//       return true;
//     },
//     filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
//   },
//   {
//     type: 'list',
//     name: 'ormType',
//     message: 'Choose ORM type:',
//     default: 'TypeORM',
//     choices: [
//       { name: 'TypeORM', value: 'typeorm' },
//       // { name: 'Sequelize', value: 'sequelize' },
//       // { name: 'Prisma', value: 'prisma' },
//       // { name: 'Mongoose', value: 'mongoose' },
//       { name: 'Knexjs', value: 'knex' },
//       { name: 'None', value: 'none' },
//     ],
//     validate: (input: string) => {
//       if (!input) return 'You must select an ORM type.';
//       return true;
//     },
//     filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
//   },
//   {
//     type: 'list',
//     name: 'copyFrom',
//     message: 'Choose boilerplate source:',
//     default: 'public-repo',
//     choices: [
//       { name: 'Public Repo', value: 'public-repo' },
//       { name: 'Private Repo', value: 'private-repo' },
//       { name: 'Copy Directory', value: 'copy-directory' },
//       { name: 'Write File', value: 'write-file' },
//       { name: 'Create Boilerplate', value: 'create-boilerplate' },
//     ],
//     validate: (input: string) => {
//       if (!input) return 'You must select a boilerplate source.';
//       return true;
//     },
//     filter: (input: string) => input.toLowerCase(), // Convert to lowercase for consistency
//   },
//   {
//     type: 'input',
//     name: 'token',
//     message: 'Enter your github token:',
//     default: '',
//     when: (answers: any) => answers.copyFrom === 'private-repo',
//     validate: (input: string) => {
//       if (!input) return 'GitHub token cannot be empty.';
//       return true;
//     },
//     filter: (input: string) => input.trim(),
//   },
//   // {
//   //   type: 'confirm',
//   //   name: 'useDocker',
//   //   message: 'Would you like to use Docker for this project?',
//   //   default: false,
//   // },
//   // {
//   //   type: 'input',
//   //   name: 'dockerImage',
//   //   message: 'Enter the Docker image name (if applicable):',
//   //   default: 'node:22',
//   //   when: (answers: any) => answers.useDocker, // Only ask if the user wants to use Docker
//   //   validate: (input: string) => {
//   //     if (!input) return 'Docker image name cannot be empty.';
//   //     return true;
//   //   },
//   // },
//   // {
//   //   type: 'checkbox',
//   //   name: 'additionalFeatures',
//   //   message: 'Select additional features you want to include:',
//   //   choices: [
//   //     // These two file should be added by default
//   //     // { name: 'tsconfig.json', value: 'tsconfig.json' },
//   //     // { name: 'Package.json', value: 'package.json' },

//   //     { name: '.eslintrc.json', value: '.eslintrc.json' },
//   //     { name: 'Linting (ESLint)', value: 'eslint' },
//   //     { name: 'Testing (Jest)', value: 'jest' },
//   //     { name: 'Prettier for code formatting', value: 'prettier' },
//   //     { name: 'TypeScript support', value: 'typescript' },
//   //     { name: '.prettierrc', value: '.prettierrc' },
//   //     { name: '.prettierignore', value: '.prettierignore' },
//   //     { name: '.editorconfig', value: '.editorconfig' },
//   //     { name: '.gitattributes', value: '.gitattributes' },
//   //     { name: '.gitignore', value: '.gitignore' },
//   //     { name: 'PM2 Config', value: 'ecosystem.config.js' },
//   //     { name: 'README.md', value: 'README.md' },
//   //     { name: '.nvmrc', value: '.nvmrc' },
//   //     { name: '.vscode/settings.json', value: '.vscode/settings.json' },
//   //     { name: '.env', value: '.env' },
//   //     { name: '.env.example', value: '.env.example' },
//   //     { name: 'License', value: 'license' },
//   //   ],
//   //   validate: (input: string) => {
//   //     if (input.length === 0) return 'You must select at least one feature.';
//   //     return true;
//   //   },
//   // },
// ] as const;

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
    filter: (input: string) => input.trim(),
  },
  {
    type: 'input',
    name: 'dbName',
    message: 'Enter database name:',
    when: (answers: any) => answers.projectName,
    default: (answers: any) => `${answers.projectName}_db`,
    validate: (input: string) => {
      if (!input) return 'Database name cannot be empty.';
      if (input.length < 3) return 'Database name should be at least 3 characters long.';
      return true;
    },
    filter: (input: string) => input.trim(),
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
    filter: (input: string) => input.toLowerCase(),
  },
  {
    type: 'input',
    name: 'dbHost',
    message: 'Enter the database host:',
    default: 'localhost',
    when: (answers: any) => answers.dbType === 'mysql' || answers.dbType === 'postgresql' || answers.dbType === 'prisma',
    validate: (input: string) => {
      if (!input) return 'Database host cannot be empty.';
      return true;
    },
    filter: (input: string) => input.trim(),
  },
  {
    type: 'input',
    name: 'dbPort',
    message: 'Enter the database port:',
    default: '3306',
    when: (answers: any) => answers.dbType === 'mysql' || answers.dbType === 'postgresql' || answers.dbType === 'prisma',
    validate: (input: string) => {
      if (!input) return 'Database port cannot be empty.';
      return true;
    },
    filter: (input: string) => input.trim(),
  },
  {
    type: 'input',
    name: 'dbUser',
    message: 'Enter the database username:',
    default: 'root',
    when: (answers: any) => answers.dbType === 'mysql' || answers.dbType === 'postgresql' || answers.dbType === 'prisma',
    validate: (input: string) => {
      if (!input) return 'Database username cannot be empty.';
      return true;
    },
    filter: (input: string) => input.trim(),
  },
  {
    type: 'password',
    name: 'dbPassword',
    message: 'Enter the database password:',
    when: (answers: any) => answers.dbType === 'mysql' || answers.dbType === 'postgresql' || answers.dbType === 'prisma',
    validate: (input: string) => {
      if (!input) return 'Database password cannot be empty.';
      return true;
    },
    filter: (input: string) => input.trim(),
  },
  {
    type: 'list',
    name: 'ormType',
    message: 'Choose ORM type:',
    default: 'TypeORM',
    choices: (answers: any) => {
      let ormChoices: string[] = [];
      switch (answers.dbType) {
        case 'mongodb':
          ormChoices = ['Mongoose', 'TypeORM'];
          break;
        case 'mysql':
        case 'postgresql':
        case 'sqlite':
        case 'prisma':
          ormChoices = ['Sequelize', 'TypeORM', 'Knex', 'Prisma'];
          break;
        default:
          ormChoices = ['None'];
      }
      return ormChoices.map(choice => ({ name: choice, value: choice.toLowerCase() }));
    },
    validate: (input: string) => {
      if (!input) return 'You must select an ORM type.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(),
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
      { name: 'Create Boilerplate', value: 'create-boilerplate' },
    ],
    validate: (input: string) => {
      if (!input) return 'You must select a boilerplate source.';
      return true;
    },
    filter: (input: string) => input.toLowerCase(),
  },
  {
    type: 'input',
    name: 'token',
    message: 'Enter your github token:',
    default: '',
    when: (answers: any) => answers.copyFrom === 'private-repo',
    validate: (input: string) => {
      if (!input) return 'GitHub token cannot be empty.';
      return true;
    },
    filter: (input: string) => input.trim(),
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
