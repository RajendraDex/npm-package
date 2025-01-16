"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectGenerator = void 0;
const featureBaseConfig_builder_1 = require("./featureBaseConfig.builder");
const directory_builder_1 = require("./directory.builder");
class ProjectGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
    }
    generate(answers) {
        console.log('Generating project structure...');
        Promise.all([this.addProjectConfig(answers)]);
        console.log('Project generation completed!');
    }
    addProjectConfig(answers) {
        const { projectName, dbName, dbType, ormType, useDocker, dockerImage, additionalFeatures } = answers;
        const featureBasedConfigBuilder = new featureBaseConfig_builder_1.FeatureBasedConfigBuilder(additionalFeatures, this.projectPath, projectName);
        featureBasedConfigBuilder.buildAndWrite();
        const directoryBuilder = new directory_builder_1.DirectoryBuilder(this.projectPath);
        directoryBuilder.createDirectoryStructure();
    }
}
exports.ProjectGenerator = ProjectGenerator;
//# sourceMappingURL=generator.project.js.map