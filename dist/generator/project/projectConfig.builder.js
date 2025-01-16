"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfigBuilder = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ProjectConfigBuilder {
    constructor() {
        this.config = {};
    }
    writeToFile(filePath, content) {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const data = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
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
                dotenv: '^16.0.0',
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
        this.config.nvmrc = '22.13.0';
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
    addEnv() {
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
    addEnvExample() {
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
    addJestConfig() {
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
    writeConfigFiles(projectPath) {
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
    }
}
exports.ProjectConfigBuilder = ProjectConfigBuilder;
//# sourceMappingURL=projectConfig.builder.js.map