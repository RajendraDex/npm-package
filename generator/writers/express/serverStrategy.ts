export const serverStrategy = `
import { Application } from 'express';
import http from 'http';
import https from 'https';

export interface ServerStrategy {
	start(): void;
}

export class HttpServerStrategy implements ServerStrategy {
	constructor(private app: Application, private port: number | string) { }

	start(): void {
		const server = http.createServer(this.app);
		server.listen(this.port, () => {
			console.log(\`HTTP Server running on port \${ this.port }\`);
		});
	}
}

export class HttpsServerStrategy implements ServerStrategy {
	constructor(
		private app: Application,
		private port: number | string,
		private sslOptions: { key: Buffer; cert: Buffer }
	) { }

	start(): void {
		const server = https.createServer(this.sslOptions, this.app);
		server.listen(this.port, () => {
			console.log(\`HTTPS Server running on port \${ this.port } \`);
		});
	}
}
`