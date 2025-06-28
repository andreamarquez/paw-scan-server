// MongoDB initialization script for Paw Scan testing environment
// This script runs when the MongoDB test container starts

// Switch to the test database
db = db.getSiblingDB('paw_scan_test');

// Create a user for the test application
db.createUser({
  user: 'paw_scan_test_user',
  pwd: 'paw_scan_test_password',
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
print('User: paw_scan_test_user'); 