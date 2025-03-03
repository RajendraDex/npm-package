import * as fs from 'fs';
import * as path from 'path';
import { expressConfig, serverFactory, serverStrategy, readme, appBootstrap, indexExports } from '@writers/express';

export class ProjectConfigBuilder {
  private config: any = {};

  private writeToFile(filePath: string, content: string | object): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
  }


  public addIndexExports(): this {
    this.config.indexExports = indexExports;
    return this;
  }
  public addAppBootstrap(): this {
    this.config.appBootstrap = appBootstrap;
    return this;
  }

  public addExpressConfig(): this {
    this.config.expressConfig = expressConfig;
    return this;
  }

  public addServerFactoryConfig(): this {
    this.config.serverFactory = serverFactory;
    return this;
  }

  public addServerStrategy(): this {
    this.config.serverStrategy = serverStrategy;
    return this;
  }
  public addServerReadme(): this {
    this.config.serverReadme = readme;
    return this;
  }

  public addPackageJson(name: string): this {
    this.config.packageJson = {
      name,
      version: '1.0.0',
      scripts: {
        start: 'node dist/app.bootstrap.js',
        build: 'tsc',
        lint: 'eslint . --ext .ts',
        format: 'prettier --write .',
      },
      dependencies: {
        express: '4.21.2',
        dotenv: '16.4.7',
        cors: '2.8.5',
        helmet: '8.0.0',
        compression: '1.7.5',
        'express-rate-limit': '7.5.0',
        morgan: '1.10.0',
        'body-parser': '1.20.2',
        'cookie-parser': '1.4.7',
        'express-validator': '7.2.1',
        'jsonwebtoken': '9.0.2',
        bcrypt: '5.1.1',
        winston: '3.17.0',
        '@apollo/server': '4.11.3',
        graphql: '16.10.0',
        passport: '0.7.0',
      },
      devDependencies: {
        typescript: '^5.7.3',
        '@typescript-eslint/eslint-plugin': '^6.0.0',
        '@typescript-eslint/parser': '^6.0.0',
        eslint: '^8.0.0',
        prettier: '^3.0.0',
        'eslint-config-prettier': '^9.0.0',
        'eslint-plugin-prettier': '^5.0.0',
        dotenv: '^16.0.0',
        'ts-jest': '^29.2.5',
        jest: '^29.7.0',
        'jest-mock-extended': '^3.0.7',
        supertest: '^7.0.0',
        'ts-node': '^10.9.2',
      },
    };
    return this;
  }

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

  public addESLint(): this {
    this.config.eslint = {
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      rules: {},
    };
    return this;
  }

  public addPrettierConfig(): this {
    this.config.prettierrc = {
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    };
    this.config.prettierignore = ['dist', 'node_modules'];
    return this;
  }

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

  public addGitAttributes(): this {
    this.config.gitattributes = `
			# Ensure consistent line endings for all developers
			* text=auto
    `;
    return this;
  }

  public addGitIgnore(): this {
    this.config.gitignore = `
		node_modules/
		dist/
		.env
    `;
    return this;
  }

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

  public addReadme(name: string): this {
    this.config.readme = `# ${name}

			This project is configured with TypeScript, ESLint, Prettier, and PM2.
    `;
    return this;
  }

  public addNvmrc(): this {
    this.config.nvmrc = '22.13.0';
    return this;
  }

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

  public addEnv(): this {
    this.config.env = `
			# Environment variables for the application
			PORT=3000
			DB_HOST=localhost
			DB_PORT=5432
			DB_USER=root
			DB_PASSWORD=example
    `;
    return this;
  }

  public addEnvExample(): this {
    this.config.envExample = `
			# Example environment variables
			PORT=3000
			DB_HOST=localhost
			DB_PORT=5432
			DB_USER=root
			DB_PASSWORD=example
    `;
    return this;
  }

  public addJestConfig(): this {
    this.config.jestConfig = `
      module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        moduleFileExtensions: ['ts', 'tsx', 'js'],
        transform: {
          '^.+\\\\.ts$': 'ts-jest',
        },
        testMatch: ['**/?(*.)+(spec|test).ts'],
        coverageDirectory: './coverage',
        collectCoverageFrom: ['src/**/*.ts'],
      };
    `;
    return this;
  }

  public addLicense(name: string): this {
    this.config.license = `
      # MIT License

      Copyright (c) ${new Date().getFullYear()} ${name}

      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:

      ***[Full license text here...]***
    `.trim();
    return this;
  }

  public writeConfigFiles(projectPath: string): void {
    if (this.config.appBootstrap) {
      this.writeToFile(path.join(`${projectPath}/src/api`, 'app.bootstrap.ts'), this.config.appBootstrap);
    }
    if (this.config.indexExports) {
      this.writeToFile(path.join(`${projectPath}/src/api/app`, 'index.ts'), this.config.indexExports);
    }
    if (this.config.expressConfig) {
      this.writeToFile(path.join(`${projectPath}/src/api/app`, 'server.ts'), this.config.expressConfig);
    }
    if (this.config.serverFactory) {
      this.writeToFile(path.join(`${projectPath}/src/api/app`, 'serverFactory.ts'), this.config.serverFactory);
    }
    if (this.config.serverStrategy) {
      this.writeToFile(path.join(`${projectPath}/src/api/app`, 'serverStrategy.ts'), this.config.serverStrategy);
    }
    if (this.config.serverReadme) {
      this.writeToFile(path.join(`${projectPath}/src/api/app`, 'readme.ts'), this.config.serverReadme);
    }

    if (this.config.packageJson) {
      this.writeToFile(path.join(projectPath, 'package.json'), this.config.packageJson);
    }
    if (this.config.tsConfig) {
      this.writeToFile(path.join(projectPath, 'tsconfig.json'), this.config.tsConfig);
    }
    if (this.config.eslint) {
      this.writeToFile(path.join(projectPath, '.eslintrc.json'), this.config.eslint);
    }
    if (this.config.prettierrc) {
      this.writeToFile(path.join(projectPath, '.prettierrc'), this.config.prettierrc);
    }
    if (this.config.prettierignore) {
      this.writeToFile(path.join(projectPath, '.prettierignore'), this.config.prettierignore.join('\n'));
    }
    if (this.config.editorconfig) {
      this.writeToFile(path.join(projectPath, '.editorconfig'), this.config.editorconfig);
    }
    if (this.config.gitattributes) {
      this.writeToFile(path.join(projectPath, '.gitattributes'), this.config.gitattributes);
    }
    if (this.config.gitignore) {
      this.writeToFile(path.join(projectPath, '.gitignore'), this.config.gitignore);
    }
    if (this.config.ecosystemConfig) {
      this.writeToFile(path.join(projectPath, 'ecosystem.config.js'), this.config.ecosystemConfig);
    }
    if (this.config.readme) {
      this.writeToFile(path.join(projectPath, 'README.md'), this.config.readme);
    }
    if (this.config.nvmrc) {
      this.writeToFile(path.join(projectPath, '.nvmrc'), this.config.nvmrc);
    }
    if (this.config.vscodeSettings) {
      this.writeToFile(path.join(projectPath, '.vscode/settings.json'), this.config.vscodeSettings);
    }
    if (this.config.env) {
      this.writeToFile(path.join(projectPath, '.env'), this.config.env);
    }
    if (this.config.envExample) {
      this.writeToFile(path.join(projectPath, '.env.example'), this.config.envExample);
    }
    if (this.config.jestConfig) {
      this.writeToFile(path.join(projectPath, 'jest.config.js'), this.config.jestConfig);
    }

    if (this.config.license) {
      this.writeToFile(path.join(projectPath, 'LICENSE'), this.config.license);
    }
  }
}
