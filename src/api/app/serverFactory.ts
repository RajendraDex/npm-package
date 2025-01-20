import { Application } from 'express';
import { ServerStrategy, HttpServerStrategy, HttpsServerStrategy } from './serverStrategy';
import fs from 'fs';

export class ServerFactory {
  static createServer(app: Application, port: number | string): ServerStrategy {
    if (process.env.NODE_ENV === 'production' && process.env.SSL_KEY && process.env.SSL_CERT) {
      const sslOptions = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
      };
      return new HttpsServerStrategy(app, port, sslOptions);
    } else {
      return new HttpServerStrategy(app, port);
    }
  }
}

