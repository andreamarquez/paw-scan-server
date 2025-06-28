// MongoDB initialization script template for Paw Scan testing environment
// This script runs when the MongoDB test container starts
// Copy this file to mongo-init-test.js and replace the placeholders with actual values

// Switch to the test database
db = db.getSiblingDB('paw_scan_test');

if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD) {
  throw new Error('MONGO_USER and MONGO_PASSWORD must be set');
}

// Create a user for the test application
db.createUser({
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'paw_scan_test'
    }
  ]
});

// Create products collection (minimal setup for testing)
db.createCollection('products');

// Create basic indexes for testing
db.products.createIndex({ barcode: 1 }, { unique: true, sparse: true });
db.products.createIndex({ name: 1, brand: 1 }, { unique: true });
db.products.createIndex({ brand: 1 });
db.products.createIndex({ rating: 1 });

print('MongoDB test initialization completed successfully!');
print('Database: paw_scan_test');
print('User: ' + process.env.MONGO_USER); 