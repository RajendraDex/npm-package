import { writeFileSync } from "fs"
import { join } from "path"

class PackageJsonGenerator {
	static instance: PackageJsonGenerator
	private projectDir!: string
	private database!: string
	private orm!: string

	constructor() { }

	static getInstance(): PackageJsonGenerator {
		if (!PackageJsonGenerator.instance) {
			PackageJsonGenerator.instance = new PackageJsonGenerator()
		}
		return PackageJsonGenerator.instance
	}

	init(projectDir: string, database: string, orm: string): PackageJsonGenerator {
		this.projectDir = projectDir
		this.database = database
		this.orm = orm
		return this;
	}

	public async generatePackageJson(): Promise<void> {
		const packageJson = {
			name: this.projectDir.split("/").pop(),
			version: "1.0.0",
			main: "dist/src/app.bootstrap.js",
			scripts: this.getScripts(),
			keywords: [],
			author: "",
			license: "ISC",
			description: "",
			dependencies: this.getDependencies(),
			devDependencies: this.getDevDependencies(),
		}

		writeFileSync(join(this.projectDir, "package.json"), JSON.stringify(packageJson, null, 2))
	}

	private getScripts(): Record<string, string> {
		const commonScripts = {
			dev: "tsx watch src/app.bootstrap.ts",
			build: "tsc && node dist/db/migrate.js && node dist/db/migrate.js migrate:tenant:latest",
			start: "nodemon dist/app.bootstrap.js",
			test: "jest",
			"test:watch": "jest --watch",
			"test:coverage": "jest --coverage",
			"migrate": " node dist/db/migrate.js ",
			"migrate:latest": "node dist/db/migrate.js",
			"migrate:tenant:latest": "node dist/db/migrate.js migrate:tenant:latest",
		}

		const ormSpecificScripts = {
			Knex: {
				migrate: "knex migrate:latest",
				"migrate:make": "knex migrate:make",
			},
			TypeORM: {
				typeorm: "typeorm-ts-node-esm",
				"migration:generate": "npm run typeorm migration:generate",
				"migration:run": "npm run typeorm migration:run",
			},
			Sequelize: {
				migrate: "sequelize db:migrate",
			},
			Prisma: {
				migrate: "prisma migrate dev",
			},
		}

		return { ...commonScripts, ...(ormSpecificScripts[this.orm as keyof typeof ormSpecificScripts] || {}) }
	}

	private getDependencies(): Record<string, string> {
		const commonDependencies = {
			"@apollo/server": "^4.11.0",
			"apollo-server-express": "^3.13.0",
			async: "^3.2.6",
			bcrypt: "^5.1.1",
			"cli-progress": "^3.12.0",
			compression: "^1.7.4",
			cors: "^2.8.5",
			dotenv: "^16.4.5",
			express: "^4.19.2",
			"express-rate-limit": "^7.4.0",
			graphql: "^16.9.0",
			helmet: "^7.1.0",
			json2csv: "^6.0.0-alpha.2",
			jsonwebtoken: "^9.0.2",
			"node-cron": "^3.0.3",
			nodemon: "^3.1.4",
			"swagger-jsdoc": "^6.2.8",
			"swagger-ui-express": "^5.0.1",
			uuid: "^10.0.0",
			winston: "^3.14.2",
			"winston-daily-rotate-file": "^5.0.0",
			zod: "^3.23.8",
		}

		const ormSpecificDependencies = {
			Knex: { knex: "^3.1.0" },
		}

		const databaseSpecificDependencies = {
			postgresql: { pg: "^8.12.0" },
			mysql: { mysql2: "latest" },
			sqlite: { sqlite3: "latest" },
			mongodb: { mongodb: "latest" },
		}

		return {
			...commonDependencies,
			...(ormSpecificDependencies[this.orm as keyof typeof ormSpecificDependencies] || {}),
			...(databaseSpecificDependencies[this.database as keyof typeof databaseSpecificDependencies] || {}),
			[this.getDatabaseDriver()]: "latest",
		}
	}

	private getDevDependencies(): Record<string, string> {
		const commonDevDependencies = {
			"@types/async": "^3.2.24",
			"@types/bcrypt": "^5.0.2",
			"@types/cli-progress": "^3.11.6",
			"@types/compression": "^1.7.5",
			"@types/express": "^4.17.21",
			"@types/graphql": "^14.5.0",
			"@types/jest": "^29.5.12",
			"@types/json2csv": "^5.0.7",
			"@types/jsonwebtoken": "^9.0.6",
			"@types/node": "^22.0.2",
			"@types/node-cron": "^3.0.11",
			"@types/supertest": "^6.0.2",
			"@types/swagger-jsdoc": "^6.0.4",
			"@types/swagger-ui-express": "^4.1.6",
			"@types/uuid": "^10.0.0",
			jest: "^29.7.0",
			"jest-mock-extended": "^3.0.7",
			supertest: "^7.0.0",
			"ts-jest": "^29.2.5",
			"ts-node": "^10.9.2",
			typescript: "^5.5.4",
		}

		const ormSpecificDevDependencies = {
			Knex: { "@types/knex": "^0.16.1" },
			Sequelize: { "sequelize-cli": "^6.2.0" },
			Prisma: { prisma: "^4.0.0" },
		}

		return {
			...commonDevDependencies,
			...(ormSpecificDevDependencies[this.orm as keyof typeof ormSpecificDevDependencies] || {}),
		}
	}

	private getDatabaseDriver(): string {
		const drivers = {
			postgresql: "pg",
			mysql: "mysql2",
			sqlite: "sqlite3",
			mongodb: "mongodb",
		}

		if (!(this.database in drivers)) {
			throw new Error("Unsupported database")
		}

		return drivers[this.database as keyof typeof drivers]
	}

	public static getConnectionConfig(database: string, orm: string): string {
		const commonConfig = `{
      host: process.env.MASTER_DB_HOST as string,
      port: parseInt(process.env.MASTER_DB_PORT || (database === 'PostgreSQL' ? '5432' : '3306')),
      user: process.env.MASTER_DB_USER || (database === 'PostgreSQL' ? 'postgres' : 'root'),
      password: process.env.MASTER_DB_PASSWORD || (database === 'PostgreSQL' ? 'postgres' : 'root'),
      database: process.env.MASTER_DB_NAME || 'myapp',
    }`

		if (database === "sqlite") {
			return orm === "Knex" ? `{ filename: './dev.sqlite3' }` : `database: "dev.sqlite3",`
		}

		if (database === "mongodb") {
			return `url: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp'`
		}

		return commonConfig
	}
}

const PackageJsonFileCreator = PackageJsonGenerator
	.getInstance();

export { PackageJsonFileCreator }

