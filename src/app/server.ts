import express, { Application, RequestHandler } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { tenantMiddleware } from '../middlewares/core/tenantMiddleware';
import { gqlSchema } from '../graphql/index';
import routes from '../routes';
import { setupSwagger } from '../utils/swagger';
import { validateToken } from '../middlewares/core/tokenValidator';
import { apiMiddleware } from '../middlewares/core/loggerMiddleware';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { formatGraphQLErrors } from '../helpers/graphQL/graphqlErrorHandler';
import { GraphQLError } from 'graphql';

dotenv.config();

export class Server {
  private static instance: Server;
  private app: Application;
  private apolloServer: ApolloServer;

  private constructor() {
    this.app = express();
    this.apolloServer = new ApolloServer({
      schema: gqlSchema,
      formatError: (formattedError, error) => formatGraphQLErrors(error as GraphQLError),
    });
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public async initialize(): Promise<void> {
    await this.configureApolloServer();
    await this.configureExpressApp();
  }

  private async configureApolloServer(): Promise<void> {
    await this.apolloServer.start();
  }

  private async configureExpressApp(): Promise<void> {
    this.app.use(helmet());
    setupSwagger(this.app);
    this.app.use(cors());
    this.app.use(express.json({ limit: process.env.JSON_PAYLOAD_SIZE || '1mb' }));
    this.app.use(apiMiddleware);
    this.app.use(tenantMiddleware);

    this.app.use('/bms', validateToken as RequestHandler);
    this.app.use(
      '/bms',
      expressMiddleware(this.apolloServer, {
        context: async ({ req }) => ({ req }),
      }) as unknown as RequestHandler
    );

    this.app.use('/api', routes);

    if (parseInt(process.env.RATE_LIMIT_REQUESTS || '0', 10) > 0) {
      this.app.use(rateLimit({
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
        max: parseInt(process.env.RATE_LIMIT_REQUESTS || '0', 10)
      }));
    }

    this.app.use(compression());
  }

  public getApp(): Application {
    return this.app;
  }
};


