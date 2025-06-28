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
              description: 'Unique identifier for the product (UUID)',
            },
            name: {
              type: 'string',
              description: 'Name of the product',
            },
            brand: {
              type: 'string',
              description: 'Brand name',
            },
            category: {
              type: 'string',
              description: 'Product category',
            },
            barcode: {
              type: 'string',
              description: 'Product barcode (8-14 digits)',
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Product rating (0-10)',
            },
            reviewCount: {
              type: 'number',
              minimum: 0,
              description: 'Number of reviews',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of ingredients',
            },
            nutritionalInfo: {
              type: 'object',
              properties: {
                protein: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Protein content percentage',
                },
                fat: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Fat content percentage',
                },
                fiber: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Fiber content percentage',
                },
                moisture: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Moisture content percentage',
                },
              },
              required: ['protein', 'fat', 'fiber', 'moisture'],
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of allergens',
            },
            lifeStage: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Target life stages',
            },
            size: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Available sizes',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to product image',
            },
            description: {
              type: 'string',
              description: 'Product description',
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
          required: ['name', 'brand', 'category', 'rating', 'reviewCount', 'ingredients', 'nutritionalInfo', 'allergens', 'lifeStage', 'size', 'price'],
        },
        CreateProduct: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the product',
            },
            brand: {
              type: 'string',
              description: 'Brand name',
            },
            category: {
              type: 'string',
              description: 'Product category',
            },
            barcode: {
              type: 'string',
              description: 'Product barcode (8-14 digits)',
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 10,
              description: 'Product rating (0-10)',
            },
            reviewCount: {
              type: 'number',
              minimum: 0,
              description: 'Number of reviews',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of ingredients',
            },
            nutritionalInfo: {
              type: 'object',
              properties: {
                protein: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Protein content percentage',
                },
                fat: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Fat content percentage',
                },
                fiber: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Fiber content percentage',
                },
                moisture: {
                  type: 'number',
                  minimum: 0,
                  maximum: 100,
                  description: 'Moisture content percentage',
                },
              },
              required: ['protein', 'fat', 'fiber', 'moisture'],
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of allergens',
            },
            lifeStage: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Target life stages',
            },
            size: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Available sizes',
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price',
            },
            imageUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to product image',
            },
            description: {
              type: 'string',
              description: 'Product description',
            },
          },
          required: ['name', 'brand', 'category', 'rating', 'reviewCount', 'ingredients', 'nutritionalInfo', 'allergens', 'lifeStage', 'size', 'price'],
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