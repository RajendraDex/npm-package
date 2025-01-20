import { ORM, Mongoose, Prisma, Knex, Sequelize, TypeORM } from '../orms';

export class ORMFactory {
	createORM(type: string): ORM {
		switch (type) {
			case 'Mongoose':
				return new Mongoose();
			case 'Prisma':
				return new Prisma();
			case 'Knex.js':
				return new Knex();
			case 'Sequelize':
				return new Sequelize();
			case 'TypeORM':
				return new TypeORM();
			default:
				throw new Error(`Unsupported ORM type: ${type}`);
		}
	}
}

