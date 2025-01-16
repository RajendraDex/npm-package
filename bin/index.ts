// #!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { questions } from '../generator/prompt/index';
import { main } from '../generator/index';


// const questions = [
//   {
//     type: 'input',
//     name: 'projectName',
//     message: 'What is your project name?',
//     default: providedName || 'my-awesome-project',
//     when: !providedName
//   },
//   {
//     type: 'list',
//     name: 'projectType',
//     message: 'What type of project do you want to create?',
//     choices: ['node-ts', 'react-ts', 'express-ts']
//   }
// ]

const program = new Command();

program
  .name('create-project')
  .description('CLI to create a new project with all configurations')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new project')
  // .argument('[name]', 'Project name')
  .action(async (providedName = null) => {
    try {
      const answers = await inquirer.prompt(questions as any);

      const projectName = providedName || answers.projectName;
      const spinner = ora('Creating project...').start();

      // const configBuilder = new ProjectConfigBuilder();
      // configBuilder
      //   .addPackageJson(projectName)
      //   .addTSConfig()
      //   .addESLint()
      //   .addPrettierConfig()
      //   .addEditorConfig()
      //   .addGitAttributes()
      //   .addGitIgnore()
      //   .addPM2Config()
      //   .addReadme(projectName)
      //   .addNvmrc()
      //   .addVSCodeSettings()
      //   .addEnv()
      //   .addEnvExample()
      //   .addJestConfig();

      // configBuilder.writeConfigFiles(`./${projectName}`);
      main(answers);

      spinner.succeed(chalk.green(`Project ${projectName} created successfully!`));

      console.log(chalk.blue('\nNext steps:'));
      console.log(chalk.yellow(`1. cd ${projectName}`));
      console.log(chalk.yellow('2. npm install'));
      console.log(chalk.yellow('3. npm run dev'));

    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

program.parse();