import { Answers } from "./answer.interface"


export class EnvFileCreator {
	static instance: EnvFileCreator

	constructor() { }

	static getInstance(): EnvFileCreator {
		if (!EnvFileCreator.instance) {
			EnvFileCreator.instance = new EnvFileCreator()
		}
		return EnvFileCreator.instance
	}

	public async createEnvFile(answers: Answers): Promise<string> {
		const fileContent = this.generateEnvFileContent(answers)
		return fileContent
	}

	private generateEnvFileContent(answers: Answers): string {
		return `
PORT=4000
NODE_ENV=development

# MASTER DB CREDENTIALS
MASTER_DB_HOST=${answers.dbHost?.trim() || ''}
MASTER_DB_USER=${answers.dbUser?.trim() || ''}
MASTER_DB_PASSWORD=${answers.dbPassword?.trim() || ''}
MASTER_DB_NAME=${answers.dbName?.trim() || ''}
MASTER_DB_PORT=${answers.dbPort?.trim() || ''}

# ACCESS TOKEN CREDS
ACCESS_TOKEN_LIFE=3600
REFRESH_TOKEN_LIFE=25600
JWT_SECRET=2024-08@secret

#SUPER DB NAME
SUPER_DATABASE=${answers.client === "mysql2" ? "mysql" : "postgres"}
NODE_ENV=local

#CAPTCHA
RECAPTCHA_SECRET_KEY=6LeSBjgqAAAAAI8l51e

#https server
BMS_API_CERT_KEY=
BMS_API_CERT_PEM=

#RATE LIMIT
RATE_LIMIT_REQUESTS=0
RATE_LIMIT_WINDOW_MS=900000

#JSON PAYLOAD SIZE
JSON_PAYLOAD_SIZE=1mb

# Pool settings
DB_POOL_MIN=0
DB_POOL_MAX=20
DB_ACQUIRE_TIMEOUT=10000
DB_IDLE_TIMEOUT=30000
STATE_CITY_COUNTRY_URL=https://dexbytes-website-storage.s3.us-east-2.amazonaws.com/bms/profilePic/1732022425332-data.json
		`
	}
}

const EnvCreator = EnvFileCreator.getInstance();

export { EnvCreator }
