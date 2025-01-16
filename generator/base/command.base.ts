// interface Command {
//   execute(): void;
//   undo(): void;
// }

// class CreateFileCommand implements Command {
//   private filePath: string;

//   constructor(filePath: string) {
//     this.filePath = filePath;
//   }

//   execute(): void {
//     require('fs').writeFileSync(this.filePath, 'File content');
//     console.log(`File created: ${this.filePath}`);
//   }

//   undo(): void {
//     require('fs').unlinkSync(this.filePath);
//     console.log(`File deleted: ${this.filePath}`);
//   }
// }

// // Usage:
// const command = new CreateFileCommand('/src/controllers/UserController.ts');
// command.execute(); // Creates the file
// command.undo(); // Deletes the file
