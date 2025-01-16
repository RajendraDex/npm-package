"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWriterFactory = void 0;
const controller_writer_1 = require("@writers/controller.writer");
const config_writer_1 = require("@writers/config.writer");
const validation_writer_1 = require("@writers/validation.writer");
const repository_writer_1 = require("@writers/repository.writer");
const model_writer_1 = require("@writers/model.writer");
const service_writer_1 = require("@writers/service.writer");
const middleware_writer_1 = require("@writers/middleware.writer");
const dbconfig_writer_1 = require("@writers/dbconfig.writer");
const ormconfig_writer_1 = require("@writers/ormconfig.writer");
class FileWriterFactory {
    static createWriter(type, name) {
        switch (type) {
            case 'controller':
                return new controller_writer_1.ControllerWriter(name);
            case 'config':
                return new config_writer_1.ConfigWriter();
            case 'validation':
                return new validation_writer_1.ValidationWriter(name);
            case 'repository':
                return new repository_writer_1.RepositoryWriter(name);
            case 'model':
                return new model_writer_1.ModelWriter(name);
            case 'service':
                return new service_writer_1.ServiceWriter(name);
            case 'middleware':
                return new middleware_writer_1.MiddlewareWriter(name);
            case 'dbConfig':
                return new dbconfig_writer_1.DBConfigWriter();
            case 'typeormConfig':
                return new ormconfig_writer_1.TypeORMConfigWriter();
            default:
                throw new Error(`Unknown writer type: ${type}`);
        }
    }
}
exports.FileWriterFactory = FileWriterFactory;
//# sourceMappingURL=fileWriter.factory.js.map