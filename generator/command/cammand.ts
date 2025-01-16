// src/command/Command.ts
export interface Command {
  execute(): void;
  undo(): void;
}
