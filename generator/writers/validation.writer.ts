// src/generator/writers/ValidationWriter.ts
import { FileWriter } from '@base/fileWriter.base';

export class ValidationWriter extends FileWriter {
  private validationName: string;

  constructor(validationName: string) {
    super();
    this.validationName = validationName;
  }

  protected getDirectoryName(): string {
    return 'src/validations';
  }

  protected getFileName(): string {
    return `${this.validationName}Validation.ts`;
  }

  protected getFileContent(): string {
    return `
import * as yup from 'yup';

export const ${this.validationName}ValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
});
    `;
  }
}
