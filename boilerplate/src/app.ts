import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { tenantMiddleware } from './middlewares/core/tenantMiddleware';
import { gqlSchema } from './graphql/index';
import routes from './routes';
import { setupSwagger } from './utils/swagger';
import { validateToken } from './middlewares/core/tokenValidator';
import { apiMiddleware } from './middlewares/core/loggerMiddleware';
import https from 'https';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import compression from 'compression';
import { formatGraphQLErrors } from './helpers/graphQL/graphqlErrorHandler';
import { GraphQLError } from 'graphql';

/**
 * @module Server
 * @description This module sets up and runs an Express server with Apollo GraphQL integration.
 * It includes configuration for security, CORS, rate limiting, and supports both HTTP and HTTPS.
 */

// Load environment variables from .env file
dotenv.config();

/**
 * Creates an Apollo Server instance.
 * @type {ApolloServer}
 */
const server = new ApolloServer({
  schema: gqlSchema,
  formatError: (formattedError, error) => formatGraphQLErrors(error as GraphQLError),
});

/**
 * Starts the Apollo Server.
 * @async
 * @function startServer
 */
const startServer = async () => {
  await server.start();
};

/**
 * Creates and configures the Express application.
 * @async
 * @function createApp
 * @returns {Promise<Application>} The configured Express application.
 */
const createApp = async (): Promise<Application> => {
  const app: Application = express();

  // Add security headers
  app.use(helmet());

  // Set up Swagger documentation
  setupSwagger(app);

  app.use(cors());
  // Limit JSON payload size based on environment variable or default to 1MB
  app.use(express.json({ limit: process.env.JSON_PAYLOAD_SIZE || '1mb' }));

  // Apply API logging middleware
  app.use(apiMiddleware);

  // Apply tenant middleware for multi-tenancy support
  app.use(tenantMiddleware);

  // Ensure Apollo Server is started before applying the middleware
  await startServer();

  // Apply token validation middleware for /bms route
  app.use('/bms', validateToken);

  // Apply Apollo GraphQL middleware and set the path to /bms
  app.use(
    '/bms',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // You can return the context object here, if needed
        return {
          req,
          // Include any other context needed for your resolvers
        };
      },
    })
  );

  // Mount all routes under `/api`
  app.use('/api', routes);

  // Configure rate limiting if enabled
  if (parseInt(process.env.RATE_LIMIT_REQUESTS || '0', 10) > 0) {
    app.use(rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // Default to 15 minutes
      max: parseInt(process.env.RATE_LIMIT_REQUESTS || '0', 10)
    }));
  }

  // Enable Gzip compression
  app.use(compression());

  return app;
};

/**
 * Creates and starts the server (HTTP or HTTPS) based on the environment.
 * @async
 * @function createServer
 */
const createServer = async () => {
  try {
    const app = await createApp();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`HTTP Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server on a single port
createServer();

export default createApp;
