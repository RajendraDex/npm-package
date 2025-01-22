#!/usr/bin/env node

// import 'module-alias/register';
import "module-alias/register.js";
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { questions } from '../generator/prompt/index';
import { main } from '../generator/index';
const program = new Command();
import { DirectoryCopier } from './cloneRepo';
import { CreateBoilerplate } from './copyPublish';
import { NodeJSStarterKit } from './cmd/create-boilerplate';

type copyType = 'public-repo' | 'private-repo' | 'copy-directory' | 'write-file' | 'create-boilerplate';

program
  .name('create-project')
  .description('CLI to create a new project with all configurations')
  .version('1.0.0');

program
  .command('create')
  .description('Create a new project')
  // .argument('[name]', 'Project name')
  .action(async () => {
    try {
      const answers = await inquirer.prompt(questions as any);

      const projectName = answers.projectName;
      const copyBoilerplateFrom: copyType = answers.copyFrom;
      const token = answers.token;
      const spinner = ora('Creating project...\n').start();
      const projectPath = path.join(process.cwd(), projectName);
      let boilerplatePath: string;

      /**
       * * This function is used to create the project with the boilerplate
       * * by file and folder creation with fs module(write file and folder)
       * * This function is used to copy the boilerplate to the project path
       * * by using the Copy whole project directory
       */

      switch (copyBoilerplateFrom) {
        case 'public-repo':
          boilerplatePath = 'https://github.com/RajendraDex/multi-tenancy-boilerplate.git';
          await new DirectoryCopier(boilerplatePath, projectPath).copyPublicRepo();
          break;
        case 'private-repo':
          if (token) {
            boilerplatePath = `https://RajendraDex:${token}@github.com/RajendraDex/multi-tenancy-boilerplate.git`;
            await new DirectoryCopier(boilerplatePath, projectPath).copyGitPrivateRepo();
          } else {
            console.log('Token is required for private repository');
          }
          break;
        case 'copy-directory':
          boilerplatePath = path.resolve(process.cwd(), '../node_modules/rajendra-npm-package/boilerplate');
          await new DirectoryCopier(boilerplatePath, projectPath).copyDirectory();
          break;
        case 'write-file':
          boilerplatePath = path.join(process.cwd(), 'boilerplate');
          await main(answers);
          break;
        case 'create-boilerplate':
          const boilerplate = new CreateBoilerplate(projectName, projectPath);
          await boilerplate.createBoilerplate();
          // ! Note: call directly from the package
          // const starterKit = new NodeJSStarterKit(projectName, projectPath);
          // await starterKit.run();
          break;
        default:
          console.log('Please select a valid boilerplate type. The options are:');
          console.log(`- public-repo`);
          console.log(`- private-repo`);
          console.log(`- copy-directory`);
          console.log(`- write-file`);
          console.log(`- create-boilerplate`);
      };

      spinner.succeed(chalk.green(`\nYour backend project "${chalk.bold(projectName)}" has been successfully created!\n`));

      console.log(chalk.yellow('\nNext steps:'));
      console.log(chalk.blue('1. cd ' + projectName));
      console.log(chalk.cyan('2. npm i') + chalk.gray('  # Install dependencies'));
      console.log(chalk.cyan('3. npm run build') + chalk.gray('  # Build the project'));
      console.log(chalk.cyan('4. npm start') + chalk.gray('  # Launch the project\n'));

    } catch (err) {
      console.error(chalk.red('Error creating project:'), err);
      process.exit(1);
    }
  });

program.parse();