"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationWriter = void 0;
const fileWriter_base_1 = require("@base/fileWriter.base");
class ValidationWriter extends fileWriter_base_1.FileWriter {
    constructor(validationName) {
        super();
        this.validationName = validationName;
    }
    getDirectoryName() {
        return 'src/validations';
    }
    getFileName() {
        return `${this.validationName}Validation.ts`;
    }
    getFileContent() {
        return `
import * as yup from 'yup';

export const ${this.validationName}ValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});
    `;
    }
}
exports.ValidationWriter = ValidationWriter;
//# sourceMappingURL=validation.writer.js.map