import { ProjectConfigBuilder } from './projectConfig.builder';

export class FeatureBasedConfigBuilder extends ProjectConfigBuilder {
  private selectedFeatures: Set<string>;
  private projectPath: string;
  private projectName: string;

  constructor(features: string[], projectPath: string, projectName: string) {
    super();
    this.selectedFeatures = new Set(features);
    this.projectPath = projectPath;
    this.projectName = projectName;
  }

  public buildAndWrite(): void {

    /**
     * !Default Express Configurations
     * 
     * * express app
     * * server factory
     * * server strategy
     * * readme.md
     * * package.json
     * * tsconfig.json
     */
    this.addExpressConfig();
    this.addServerFactoryConfig();
    this.addServerStrategy();
    this.addServerReadme();
    this.addIndexExports();
    this.addAppBootstrap();
    this.addPackageJson(this.projectName);
    this.addTSConfig();

    /**
     * !Selected by User during project generation
     */
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
    if (this.selectedFeatures.has('license')) {
      this.addLicense(this.projectName);
    }

    //* Finally write the selected configurations to files
    this.writeConfigFiles(this.projectPath);
  }
}
