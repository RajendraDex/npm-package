export class ProjectConfigBuilder {
  private config: any = {};

  // Add package.json
  public addPackageJson(name: string): this {
    this.config.packageJson = {
      name,
      version: '1.0.0',
      scripts: {
        start: 'node dist/index.js',
        build: 'tsc',
        lint: 'eslint . --ext .ts',
        format: 'prettier --write .',
        test: 'echo "No tests defined" && exit 0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        eslint: '^8.0.0',
        prettier: '^3.0.0',
        'eslint-config-prettier': '^9.0.0',
        'eslint-plugin-prettier': '^5.0.0',
        'ts-node': '^10.0.0',
      },
    };
    return this;
  }

  // Add tsconfig.json
  public addTSConfig(): this {
    this.config.tsConfig = {
      compilerOptions: {
        target: 'ESNext',
        module: 'CommonJS',
        outDir: 'dist',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    };
    return this;
  }

  // Add ESLint configuration
  public addESLint(): this {
    this.config.eslint = {
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      rules: {},
    };
    return this;
  }

  // Add Prettier configuration
  public addPrettierConfig(): this {
    this.config.prettierrc = {
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    };
    this.config.prettierignore = ['dist', 'node_modules'];
    return this;
  }

  // Add .editorconfig
  public addEditorConfig(): this {
    this.config.editorconfig = `
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
end_of_line = lf
trim_trailing_whitespace = true
insert_final_newline = true
    `;
    return this;
  }

  // Add .gitattributes
  public addGitAttributes(): this {
    this.config.gitattributes = `
# Ensure consistent line endings for all developers
* text=auto
    `;
    return this;
  }

  // Add .gitignore
  public addGitIgnore(): this {
    this.config.gitignore = `
node_modules/
dist/
.env
    `;
    return this;
  }

  // Add ecosystem.config.js for PM2
  public addPM2Config(): this {
    this.config.ecosystemConfig = `
module.exports = {
  apps: [
    {
      name: 'my-app',
      script: './dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
    `;
    return this;
  }

  // Add README.md
  public addReadme(name: string): this {
    this.config.readme = `# ${name}

This project is configured with TypeScript, ESLint, Prettier, and PM2.
    `;
    return this;
  }

  // Add .nvmrc
  public addNvmrc(): this {
    this.config.nvmrc = '16';
    return this;
  }

  // Add .vscode/settings.json
  public addVSCodeSettings(): this {
    this.config.vscodeSettings = {
      'editor.formatOnSave': true,
      'editor.tabSize': 2,
      '[typescript]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
    };
    return this;
  }

  // Final build method
  public build(): any {
    return this.config;
  }
}

// Usage example
const configBuilder = new ProjectConfigBuilder();
const projectConfig = configBuilder
  .addPackageJson('my-project')
  .addTSConfig()
  .addESLint()
  .addPrettierConfig()
  .addEditorConfig()
  .addGitAttributes()
  .addGitIgnore()
  .addPM2Config()
  .addReadme('My Project')
  .addNvmrc()
  .addVSCodeSettings()
  .build();

console.log(projectConfig);
