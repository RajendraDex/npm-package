"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureBasedConfigBuilder = void 0;
const projectConfig_builder_1 = require("./projectConfig.builder");
class FeatureBasedConfigBuilder extends projectConfig_builder_1.ProjectConfigBuilder {
    constructor(features, projectPath, projectName) {
        super();
        this.selectedFeatures = new Set(features);
        this.projectPath = projectPath;
        this.projectName = projectName;
    }
    buildAndWrite() {
        if (this.selectedFeatures.has('package.json')) {
            this.addPackageJson(this.projectName);
        }
        if (this.selectedFeatures.has('tsconfig.json')) {
            this.addTSConfig();
        }
        if (this.selectedFeatures.has('.eslintrc.json')) {
            this.addESLint();
        }
        if (this.selectedFeatures.has('.prettierrc') || this.selectedFeatures.has('.prettierignore')) {
            this.addPrettierConfig();
        }
        if (this.selectedFeatures.has('.editorconfig')) {
            this.addEditorConfig();
        }
        if (this.selectedFeatures.has('.gitattributes')) {
            this.addGitAttributes();
        }
        if (this.selectedFeatures.has('.gitignore')) {
            this.addGitIgnore();
        }
        if (this.selectedFeatures.has('ecosystem.config.js')) {
            this.addPM2Config();
        }
        if (this.selectedFeatures.has('README.md')) {
            this.addReadme(this.projectName);
        }
        if (this.selectedFeatures.has('.nvmrc')) {
            this.addNvmrc();
        }
        if (this.selectedFeatures.has('.vscode/settings.json')) {
            this.addVSCodeSettings();
        }
        if (this.selectedFeatures.has('.env')) {
            this.addEnv();
        }
        if (this.selectedFeatures.has('.env.example')) {
            this.addEnvExample();
        }
        if (this.selectedFeatures.has('jest')) {
            this.addJestConfig();
        }
        this.writeConfigFiles(this.projectPath);
    }
}
exports.FeatureBasedConfigBuilder = FeatureBasedConfigBuilder;
//# sourceMappingURL=featureBaseConfig.builder.js.map