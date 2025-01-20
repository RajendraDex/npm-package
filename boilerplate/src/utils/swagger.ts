import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Basic Authentication Middleware
const basicAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Enter username and password"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Replace these with your actual credentials
  const validUsername = 'dexbytes-infotech';
  const validPassword = 'Dexbytes@2015';

  if (username === validUsername && password === validPassword) {
    next();
  } else {
    res.status(401).send('Invalid credentials.');
  }
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaaS Booking Management',
      version: '1.0.0',
      description: 'A simple Express API application documented with Swagger',
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: express.Application) => {
  app.use('/api-document', basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
