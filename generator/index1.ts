import 'module-alias/register';
// import { ProjectBuilder } from './project/projectConfig.builder';
// import { CommandInvoker } from './command/Innvoker.command';
// import { FileWriteCommand } from './command/fileWrite.command';
// import { FileWriterFactory } from './factory/fileWriter.factory';
// import { Observable } from './events/observer';
// import path from 'path';

// const main = async () => {
//   const projectName = 'my-advanced-ts-project';
//   const projectPath = path.join(process.cwd(), projectName);

//   // Observer Pattern: Set up dependency management
//   const dbConfigObservable = new Observable();
//   const dbConfigWriter = new DBConfigWriter(dbConfigObservable);
//   const typeOrmConfigWriter = new TypeORMConfigWriter();

//   dbConfigObservable.subscribe((newConfig) => {
//     typeOrmConfigWriter.updateConfig(newConfig);
//   });

//   // Command Pattern: Encapsulate file creation
//   const invoker = new CommandInvoker();
//   invoker.executeCommand(new FileWriteCommand(dbConfigWriter, projectPath));
//   invoker.executeCommand(new FileWriteCommand(typeOrmConfigWriter, projectPath));

//   // Builder Pattern: Construct project structure
//   const builder = new ProjectBuilder();
//   builder
//     .addController('User')
//     .addService('User')
//     .addModel('User')
//     .addRepository('User')
//     .addValidation('User')
//     .addConfig('dbConfig')
//     .addConfig('typeormConfig')
//     .build(projectPath);

//   console.log('Project created successfully!');
// };

// main().catch((err) => {
//   console.error('Error:', err);
// });
