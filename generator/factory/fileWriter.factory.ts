import { ControllerWriter } from '@writers/controller.writer';
import { ConfigWriter } from '@writers/config.writer';
import { ValidationWriter } from '@writers/validation.writer';
import { RepositoryWriter } from '@writers/repository.writer';
import { ModelWriter } from '@writers/model.writer';
import { ServiceWriter } from '@writers/service.writer';
import { MiddlewareWriter } from '@writers/middleware.writer';
import { DBConfigWriter } from '@writers/dbconfig.writer';
import { TypeORMConfigWriter } from '@writers/ormconfig.writer';
import { FileWriter } from '@base/fileWriter.base';

type WriterType =
  | 'controller'
  | 'config'
  | 'validation'
  | 'repository'
  | 'model'
  | 'service'
  | 'middleware'
  | 'dbConfig'
  | 'typeormConfig';

export class FileWriterFactory {
  public static createWriter(type: WriterType, name?: string): FileWriter {
    switch (type) {
      case 'controller':
        return new ControllerWriter(name!);
      case 'config':
        return new ConfigWriter();
      case 'validation':
        return new ValidationWriter(name!);
      case 'repository':
        return new RepositoryWriter(name!);
      case 'model':
        return new ModelWriter(name!);
      case 'service':
        return new ServiceWriter(name!);
      case 'middleware':
        return new MiddlewareWriter(name!);
      case 'dbConfig':
        return new DBConfigWriter();
      case 'typeormConfig':
        return new TypeORMConfigWriter();
      default:
        throw new Error(`Unknown writer type: ${type}`);
    }
  }
}
