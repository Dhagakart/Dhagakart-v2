const path = require('path');

// Import the schemas file
require('./swaggerSchemas');

/**
 * Swagger configuration options
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DhagaKart E-commerce API',
      version: '1.0.0',
      description: 'API documentation for DhagaKart E-commerce application',
      contact: {
        name: 'API Support',
        email: 'dsharpsglobal@gmail.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://dhagakart.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Products',
        description: 'API for managing products',
      },
      // More tags can be added here for other routes
    ],
    // Global responses that can be referenced using $ref
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
      },
      NotFound: {
        description: 'The requested resource was not found',
      },
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/**/*.js'),
    path.join(__dirname, './swaggerSchemas.js'), // Include the schemas file
  ],
};

module.exports = swaggerOptions;
