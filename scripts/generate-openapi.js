const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Paw Scan API',
      version: '1.0.0',
      description: 'API for Paw Scan pet food rating application',
      contact: {
        name: 'Paw Scan Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Ingredient: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'UUID for the ingredient' },
            name: { type: 'string', description: 'Name of the ingredient' },
            status: { type: 'string', enum: ['excellent', 'good', 'fair', 'poor'], description: 'Quality status' },
            description: { type: 'string', description: 'Description of the ingredient' },
          },
          required: ['name', 'status', 'description'],
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'UUID for the product' },
            name: { type: 'string' },
            barcode: { type: 'string' },
            brand: { type: 'string' },
            rating: { type: 'number' },
            ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            imageUrl: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          required: ['id', 'name', 'brand', 'rating', 'ingredients', 'createdAt', 'updatedAt'],
        },
        CreateProduct: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            barcode: { type: 'string' },
            brand: { type: 'string' },
            rating: { type: 'number' },
            ingredients: { type: 'array', items: { $ref: '#/components/schemas/Ingredient' } },
            imageUrl: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['name', 'brand', 'rating', 'ingredients'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
            },
            data: {
              description: 'Response data',
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Product',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number',
                },
                limit: {
                  type: 'integer',
                  description: 'Number of items per page',
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items',
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);
const yamlContent = JSON.stringify(specs, null, 2);

// Write to openapi.yml file
fs.writeFileSync(path.join(__dirname, '..', 'openapi.yml'), yamlContent);
console.log('✅ OpenAPI YAML file generated successfully: openapi.yml'); 