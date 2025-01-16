abstract class Validator {
  protected nextValidator?: Validator;

  public setNext(validator: Validator): Validator {
    this.nextValidator = validator;
    return validator;
  }

  public validate(data: any): boolean {
    if (this.nextValidator) {
      return this.nextValidator.validate(data);
    }
    return true;
  }
}

class ProjectNameValidator extends Validator {
  public validate(data: any): boolean {
    if (data.projectName.length < 3) {
      throw new Error('Project name must be at least 3 characters long.');
    }
    return super.validate(data);
  }
}

class DatabaseValidator extends Validator {
  public validate(data: any): boolean {
    if (!['MySQL', 'PostgreSQL', 'MongoDB'].includes(data.dbType)) {
      throw new Error('Invalid database type.');
    }
    return super.validate(data);
  }
}

// Usage:
const data = { projectName: 'MyApp', dbType: 'MySQL' };

const validator = new ProjectNameValidator();
validator.setNext(new DatabaseValidator());

validator.validate(data); // Passes validation
