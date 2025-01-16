// // src/command/FileWriteCommand.ts
// import { FileWriter } from '../base/fileWriter.base';
// import { Command } from './cammand';

// export class FileWriteCommand implements Command {
//   private writer: FileWriter;
//   private projectPath: string;

//   constructor(writer: FileWriter, projectPath: string) {
//     this.writer = writer;
//     this.projectPath = projectPath;
//   }

//   execute(): void {
//     this.writer.writeFile(this.projectPath);
//   }

//   undo(): void {
//     console.log(`Undoing creation of ${this.writer.getFileName()}...`);
//     // Logic to delete the file can be added here.
//   }
// }
