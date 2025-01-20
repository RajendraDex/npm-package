#!/usr/bin/env node

import 'module-alias/register';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { questions } from '../generator/prompt/index';
// import { main } from '../generator/index';
const program = new Command();
import { DirectoryCopier } from './cloneRepo';

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
      const spinner = ora('Creating project...\n').start();
      const projectPath = path.join(process.cwd(), projectName);

      const boilerplatePath = path.join(process.cwd(), 'boilerplate');

      /**
       * * This function is used to create the project with the boilerplate
       * * by file and folder creation with fs module(write file and folder)
       */
      // await main(answers); // ! working

      /**
       * * This function is used to copy the boilerplate to the project path
       * * by using the Copy whole project directory
       */
      // await new DirectoryCopier(boilerplatePath, projectPath).copyDirectory(); // ! working
      await new DirectoryCopier(boilerplatePath, projectPath).copyDirectoryByModule(); // ! working

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