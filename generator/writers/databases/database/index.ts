export interface Database {
	getName(): string;
	getConnectionString(): string;
}

export class MySQL implements Database {
	getName() {
		return 'MySQL';
	}
	getConnectionString() {
		return 'mysql://user:password@localhost:3306/mydb';
	}
}

export class PostgreSQL implements Database {
	getName() {
		return 'PostgreSQL';
	}
	getConnectionString() {
		return 'postgresql://user:password@localhost:5432/mydb';
	}
}

export class MongoDB implements Database {
	getName() {
		return 'MongoDB';
	}
	getConnectionString() {
		return 'mongodb://localhost:27017/mydb';
	}
}

export class MSSQL implements Database {
	getName() {
		return 'MSSQL';
	}
	getConnectionString() {
		return 'mssql://user:password@localhost:1433/mydb';
	}
}

