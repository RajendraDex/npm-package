import { ProjectGenerator } from '@project/generator.project';
import { ProjectConfigBuilder } from '@project/projectConfig.builder';
import inquirer from 'inquirer';
import path from 'path';
import { questions } from '@prompt/index';

export const main = async (ans: any) => {
  const answers = ans || (await inquirer.prompt(questions as any));

  const projectPath = path.join(process.cwd(), answers.projectName);

  const generator = new ProjectGenerator(projectPath);
  generator.generate(answers);
};
