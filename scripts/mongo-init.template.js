// MongoDB initialization script template for Paw Scan application
// This script runs when the MongoDB container starts for the first time
// Copy this file to mongo-init.js and replace the placeholders with actual values

// Switch to the paw_scan database
db = db.getSiblingDB('paw_scan');

if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD) {
  throw new Error('MONGO_USER and MONGO_PASSWORD must be set');
}

// Create a user for the application
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'paw_scan'
    }
  ]
});

// Create collections with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'brand', 'category', 'rating', 'reviewCount', 'ingredients', 'nutritionalInfo', 'allergens', 'lifeStage', 'size', 'price'],
      properties: {
        name: {
          bsonType: 'string',
          maxLength: 200
        },
        brand: {
          bsonType: 'string',
          maxLength: 100
        },
        category: {
          bsonType: 'string',
          maxLength: 100
        },
        barcode: {
          bsonType: 'string',
          pattern: '^\\d{8,14}$'
        },
        rating: {
          bsonType: 'number',
          minimum: 0,
          maximum: 10
        },
        reviewCount: {
          bsonType: 'number',
          minimum: 0
        },
        ingredients: {
          bsonType: 'array',
          minItems: 1,
          items: {
            bsonType: 'string'
          }
        },
        nutritionalInfo: {
          bsonType: 'object',
          required: ['protein', 'fat', 'fiber', 'moisture'],
          properties: {
            protein: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100
            },
            fat: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100
            },
            fiber: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100
            },
            moisture: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100
            }
          }
        },
        allergens: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        lifeStage: {
          bsonType: 'array',
          minItems: 1,
          items: {
            bsonType: 'string'
          }
        },
        size: {
          bsonType: 'array',
          minItems: 1,
          items: {
            bsonType: 'string'
          }
        },
        price: {
          bsonType: 'number',
          minimum: 0
        },
        imageUrl: {
          bsonType: 'string'
        },
        description: {
          bsonType: 'string',
          maxLength: 1000
        }
      }
    }
  }
});

// Create indexes for better performance
db.products.createIndex({ barcode: 1 }, { unique: true, sparse: true });
db.products.createIndex({ name: 1, brand: 1 }, { unique: true });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ rating: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ createdAt: -1 });

// Create text index for search functionality
db.products.createIndex({
  name: 'text',
  brand: 'text',
  category: 'text',
  ingredients: 'text'
});

print('MongoDB initialization completed successfully!');
print('Database: paw_scan');
print('User: ' + (process.env.MONGO_USER || 'paw_scan_user'));
print('Collections: products'); 