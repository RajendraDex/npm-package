// src/command/CommandInvoker.ts
import { Command } from './cammand';

export class CommandInvoker {
  private history: Command[] = [];

  public executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  public undo(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    } else {
      console.log('No commands to undo.');
    }
  }
}
