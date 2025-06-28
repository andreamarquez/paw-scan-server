import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  // Connect to test database
  const testMongoUri = process.env['MONGODB_URI_TEST'] || 'mongodb://localhost:27017/paw-scan-test';
  await mongoose.connect(testMongoUri);
});

// Global test teardown
afterAll(async () => {
  // Disconnect from test database
  await mongoose.disconnect();
});

// Clean up database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
}); 