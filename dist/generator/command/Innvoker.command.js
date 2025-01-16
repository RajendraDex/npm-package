"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInvoker = void 0;
class CommandInvoker {
    constructor() {
        this.history = [];
    }
    executeCommand(command) {
        command.execute();
        this.history.push(command);
    }
    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo();
        }
        else {
            console.log('No commands to undo.');
        }
    }
}
exports.CommandInvoker = CommandInvoker;
//# sourceMappingURL=Innvoker.command.js.map