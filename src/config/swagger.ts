import swaggerJsdoc from 'swagger-jsdoc';

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
            name: {
              type: 'string',
              description: 'Name of the ingredient',
            },
            status: {
              type: 'string',
              enum: ['excellent', 'good', 'fair', 'poor'],
              description: 'Quality status of the ingredient',
            },
            description: {
              type: 'string',
              description: 'Description of the ingredient',
            },
          },
          required: ['name', 'status', 'description'],
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the product',
            },
            name: {
              type: 'string',
              description: 'Name of the product',
            },
            barcode: {
              type: 'string',
              description: 'Product barcode (8-14 digits)',
            },
            brand: {
              type: 'string',
              description: 'Brand name',
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Product rating (0-10)',
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'URL to product image',
            },
            ingredients: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Ingredient',
              },
              description: 'List of ingredients',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
          required: ['name', 'barcode', 'brand', 'rating', 'image', 'ingredients'],
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

export const specs = swaggerJsdoc(options); 