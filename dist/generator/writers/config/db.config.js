"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConfigWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class DBConfigWriter extends fileWriter_base_1.FileWriter {
    constructor(observable) {
        super();
        this.observable = observable;
    }
    getDirectoryName() {
        return 'src/config';
    }
    getFileName() {
        return 'databaseConfig.ts';
    }
    getFileContent() {
        const content = `
		export const databaseConfig = {
		type: 'postgres',
		host: 'localhost',
		port: 5432,
		username: 'root',
		password: 'password',
		database: 'example_db',
		};
    `;
        this.observable.notify(content);
        return content;
    }
}
exports.DBConfigWriter = DBConfigWriter;
//# sourceMappingURL=db.config.js.map