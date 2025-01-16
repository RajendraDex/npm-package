// // src/generator/ProjectBuilder.ts
// import { FileWriterFactory } from '@fileWriterFactory/index';
// import { FileWriter } from '@fileWriter/base/FileWriter';

// export class ProjectBuilder {
//   private writers: FileWriter[] = [];

//   public addController(name: string): this {
//     const writer = FileWriterFactory.createWriter('controller', name);
//     this.writers.push(writer);
//     return this;
//   }

//   public addService(name: string): this {
//     const writer = FileWriterFactory.createWriter('service', name);
//     this.writers.push(writer);
//     return this;
//   }

//   public addModel(name: string): this {
//     const writer = FileWriterFactory.createWriter('model', name);
//     this.writers.push(writer);
//     return this;
//   }

//   public addRepository(name: string): this {
//     const writer = FileWriterFactory.createWriter('repository', name);
//     this.writers.push(writer);
//     return this;
//   }

//   public addValidation(name: string): this {
//     const writer = FileWriterFactory.createWriter('validation', name);
//     this.writers.push(writer);
//     return this;
//   }

//   public addConfig(type: 'dbConfig' | 'typeormConfig'): this {
//     const writer = FileWriterFactory.createWriter(type);
//     this.writers.push(writer);
//     return this;
//   }

//   public build(projectPath: string): void {
//     console.log('Building project structure...');
//     this.writers.forEach((writer) => writer.writeFile(projectPath));
//     console.log('Project structure created successfully!');
//   }
// }
