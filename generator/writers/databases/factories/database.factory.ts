import { Database, MySQL, PostgreSQL, MongoDB, MSSQL } from '../database';

export class DatabaseFactory {
	createDatabase(type: string): Database {
		switch (type) {
			case 'MySQL':
				return new MySQL();
			case 'PostgreSQL':
				return new PostgreSQL();
			case 'MongoDB':
				return new MongoDB();
			case 'MSSQL':
				return new MSSQL();
			default:
				throw new Error(`Unsupported database type: ${type}`);
		}
	}
}

