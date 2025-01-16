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
exports.DirectoryBuilder = void 0;
const path = __importStar(require("path"));
const createDir_1 = require("@utils/createDir");
class DirectoryBuilder {
    constructor(basePath) {
        if (!basePath) {
            throw new Error('Base path must be provided.');
        }
        this.basePath = basePath;
    }
    getDirectoryStructure() {
        const projectPath = path.join(this.basePath, 'src', 'api');
        const corePath = path.join(projectPath, 'core');
        return [
            path.join(projectPath, 'config'),
            path.join(projectPath, 'shared'),
            path.join(corePath, 'database'),
            path.join(corePath, 'middleware'),
            path.join(corePath, 'routes', 'v1'),
            path.join(corePath, 'services'),
            path.join(corePath, 'utils'),
            path.join(corePath, 'validators'),
            path.join(corePath, 'controllers'),
            path.join(corePath, 'repositories'),
            path.join(corePath, 'models'),
        ];
    }
    createDirectoryStructure() {
        const directories = this.getDirectoryStructure();
        directories.forEach((dir) => {
            try {
                (0, createDir_1.createDir)(dir);
                console.log(`Directory created: ${dir}`);
            }
            catch (error) {
                console.error(`Failed to create directory: ${dir}`, error);
            }
        });
    }
}
exports.DirectoryBuilder = DirectoryBuilder;
//# sourceMappingURL=directory.builder.js.map