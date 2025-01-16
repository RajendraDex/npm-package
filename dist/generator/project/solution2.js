"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfigBuilder = void 0;
class ProjectConfigBuilder {
    constructor() {
        this.config = {};
    }
    addPackageJson(name) {
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
    addTSConfig() {
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
    addESLint() {
        this.config.eslint = {
            parser: '@typescript-eslint/parser',
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
            rules: {},
        };
        return this;
    }
    addPrettierConfig() {
        this.config.prettierrc = {
            semi: true,
            singleQuote: true,
            trailingComma: 'all',
        };
        this.config.prettierignore = ['dist', 'node_modules'];
        return this;
    }
    addEditorConfig() {
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
    addGitAttributes() {
        this.config.gitattributes = `
# Ensure consistent line endings for all developers
* text=auto
    `;
        return this;
    }
    addGitIgnore() {
        this.config.gitignore = `
node_modules/
dist/
.env
    `;
        return this;
    }
    addPM2Config() {
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
    addReadme(name) {
        this.config.readme = `# ${name}

This project is configured with TypeScript, ESLint, Prettier, and PM2.
    `;
        return this;
    }
    addNvmrc() {
        this.config.nvmrc = '16';
        return this;
    }
    addVSCodeSettings() {
        this.config.vscodeSettings = {
            'editor.formatOnSave': true,
            'editor.tabSize': 2,
            '[typescript]': {
                'editor.defaultFormatter': 'esbenp.prettier-vscode',
            },
        };
        return this;
    }
    build() {
        return this.config;
    }
}
exports.ProjectConfigBuilder = ProjectConfigBuilder;
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
//# sourceMappingURL=solution2.js.map