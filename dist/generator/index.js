"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const generator_project_1 = require("@project/generator.project");
const inquirer_1 = __importDefault(require("inquirer"));
const path_1 = __importDefault(require("path"));
const index_1 = require("@prompt/index");
const main = async () => {
    console.log('main');
    const answers = await inquirer_1.default.prompt(index_1.questions);
    const projectPath = path_1.default.join(process.cwd(), answers.projectName);
    console.log('🚀 -------- file: index.ts:12 -------- main -------- projectPath:', projectPath);
    const generator = new generator_project_1.ProjectGenerator(projectPath);
    generator.generate(answers);
};
exports.main = main;
//# sourceMappingURL=index.js.map