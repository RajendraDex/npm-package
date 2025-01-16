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
                lint: 'eslint .',
                format: 'prettier --write .',
            },
            dependencies: {},
            devDependencies: {
                typescript: '^5.2.2',
                eslint: '^8.51.0',
                '@typescript-eslint/parser': '^6.7.3',
                '@typescript-eslint/eslint-plugin': '^6.7.3',
                prettier: '^3.2.1',
                'eslint-config-prettier': '^9.0.0',
                'eslint-plugin-prettier': '^5.1.0',
                pm2: '^5.3.0',
            },
        };
        return this;
    }
    addTSConfig() {
        this.config.tsConfig = {
            compilerOptions: {
                target: 'ES6',
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
    addEditorConfig() {
        this.config.editorConfig = `
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
`.trim();
        return this;
    }
    addGitAttributes() {
        this.config.gitAttributes = `
* text=auto
`.trim();
        return this;
    }
    addGitIgnore() {
        this.config.gitIgnore = `
node_modules/
dist/
.env
*.log
`.trim();
        return this;
    }
    addPrettierIgnore() {
        this.config.prettierIgnore = `
dist/
node_modules/
*.log
`.trim();
        return this;
    }
    addPrettierConfig() {
        this.config.prettierConfig = {
            singleQuote: true,
            semi: true,
            trailingComma: 'all',
            tabWidth: 2,
        };
        return this;
    }
    addPM2Ecosystem() {
        this.config.ecosystem = `
module.exports = {
  apps: [
    {
      name: '${this.config.packageJson?.name || 'app'}',
      script: 'dist/index.js',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};
`.trim();
        return this;
    }
    addLicense() {
        this.config.license = `
MIT License

Copyright (c) ${new Date().getFullYear()} [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Full license text here...]
`.trim();
        return this;
    }
    addReadme() {
        this.config.readme = `
# ${this.config.packageJson?.name || 'Project Name'}

## Setup
\`\`\`bash
npm install
npm run build
npm start
\`\`\`
`.trim();
        return this;
    }
    addNvmrc() {
        this.config.nvmrc = `node 18`;
        return this;
    }
    addVSCodeSettings() {
        this.config.vscodeSettings = {
            'editor.formatOnSave': true,
            'files.exclude': {
                '**/node_modules': true,
                '**/dist': true,
            },
            'typescript.tsdk': './node_modules/typescript/lib',
        };
        return this;
    }
    build() {
        return this.config;
    }
}
exports.ProjectConfigBuilder = ProjectConfigBuilder;
const projectConfig = new ProjectConfigBuilder()
    .addPackageJson('my-project')
    .addTSConfig()
    .addESLint()
    .addEditorConfig()
    .addGitAttributes()
    .addGitIgnore()
    .addPrettierIgnore()
    .addPrettierConfig()
    .addPM2Ecosystem()
    .addLicense()
    .addReadme()
    .addNvmrc()
    .addVSCodeSettings()
    .build();
console.log(projectConfig);
//# sourceMappingURL=solution1.js.map