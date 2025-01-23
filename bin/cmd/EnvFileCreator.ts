import fs from "fs"
import path from "path"
import { Answers } from "./answer.interface"


export class EnvFileCreator {
	static instance: EnvFileCreator
	private readonly baseDir: string

	constructor() {
		this.baseDir = path.resolve(__dirname, "../../../")
	}

	static getInstance(): EnvFileCreator {
		if (!EnvFileCreator.instance) {
			EnvFileCreator.instance = new EnvFileCreator()
		}
		return EnvFileCreator.instance
	}

	public async createEnvFile(answers: Answers, projectName: string): Promise<void> {
		const projectFolderPath = path.join(this.baseDir, projectName?.trim()?.toLowerCase() || 'my-app')
		// const projectFolderPath = path.resolve(__dirname, '../../../', projectName.trim().toLowerCase());
		try {
			await this.createProjectDirectory(projectFolderPath)
			await this.writeEnvFile(projectFolderPath, answers)
		} catch (error) {
			console.error("Error in createEnvFile:", error)
		}
	}

	private async createProjectDirectory(projectFolderPath: string): Promise<void> {
		if (!fs.existsSync(projectFolderPath)) {
			await fs.promises.mkdir(projectFolderPath, { recursive: true })
		}
	}

	private async writeEnvFile(projectFolderPath: string, answers: Answers): Promise<void> {
		const filePath = path.join(projectFolderPath, ".env");

		if (!fs.existsSync(filePath)) {
			const fileContent = this.generateEnvFileContent(answers)
			try {
				await fs.promises.writeFile(filePath, fileContent.trim())
				console.log("Created .env file.")
			} catch (error) {
				console.error("Error writing .env file:", error)
			}
		}
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
			STATE_CITY_COUNTRY_URL=https://example.com/bms/profilePic/1732022425332-data.json
		`
	}
}

const EnvCreator = EnvFileCreator.getInstance();

export { EnvCreator }
