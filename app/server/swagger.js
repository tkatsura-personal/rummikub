import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rummikub API',
      version: '1.0.0',
      description: 'REST API for the Rummikub multiplayer game server (users, games, hand, table, and tile endpoints).',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs (files containing @swagger/@openapi comments)
  apis: ['./server.js'], // adjust paths to your route files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };