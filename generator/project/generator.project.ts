// src/generator/ProjectGenerator.ts
// import { FileWriterFactory } from '@factory/fileWriter.factory';
// import { ProjectConfigBuilder } from './projectConfig.builder';
import { FeatureBasedConfigBuilder } from './featureBaseConfig.builder';
import { DirectoryBuilder } from './directory.builder';
export class ProjectGenerator {
  private projectPath: string;

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  public generate(answers: any) {
    console.log('Generating project structure...');

    // Project initial config
    Promise.all([this.addProjectConfig(answers)]);

    // TODO: need to implement controller
    // const controllerWriter = FileWriterFactory.createWriter('controller', 'User');
    // controllerWriter.writeFile(this.projectPath);

    // Create config
    // const configWriter = FileWriterFactory.createWriter('config');
    // configWriter.writeFile(this.projectPath);

    console.log('Project generation completed!');
  }
  public addProjectConfig(answers: any) {
    const { projectName, dbName, dbType, ormType, useDocker, dockerImage, additionalFeatures } = answers;

    //* Directory builder
    const directoryBuilder = new DirectoryBuilder(this.projectPath);
    directoryBuilder.createDirectoryStructure();

    //* Feature based config
    const featureBasedConfigBuilder = new FeatureBasedConfigBuilder(additionalFeatures, this.projectPath, projectName);
    featureBasedConfigBuilder.buildAndWrite();


    // TODO: need to implement database config

    // // database config
    // const databaseConfigBuilder = new DatabaseConfigBuilder(
    //   dbName,
    //   dbType,
    //   ormType,
    //   useDocker,
    //   dockerImage,
    // );
    // databaseConfigBuilder.buildAndWrite();
  }
}
