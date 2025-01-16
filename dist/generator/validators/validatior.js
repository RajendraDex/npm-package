"use strict";
class Validator {
    setNext(validator) {
        this.nextValidator = validator;
        return validator;
    }
    validate(data) {
        if (this.nextValidator) {
            return this.nextValidator.validate(data);
        }
        return true;
    }
}
class ProjectNameValidator extends Validator {
    validate(data) {
        if (data.projectName.length < 3) {
            throw new Error('Project name must be at least 3 characters long.');
        }
        return super.validate(data);
    }
}
class DatabaseValidator extends Validator {
    validate(data) {
        if (!['MySQL', 'PostgreSQL', 'MongoDB'].includes(data.dbType)) {
            throw new Error('Invalid database type.');
        }
        return super.validate(data);
    }
}
const data = { projectName: 'MyApp', dbType: 'MySQL' };
const validator = new ProjectNameValidator();
validator.setNext(new DatabaseValidator());
validator.validate(data);
//# sourceMappingURL=validatior.js.map