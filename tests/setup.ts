import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Set test environment
process.env['NODE_ENV'] = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Check if we're running integration tests by looking at the test file path
const isIntegrationTest = () => {
  const testPath = expect.getState().testPath || '';
  return testPath.includes('integration');
};

// Only connect to MongoDB for integration tests
// Unit tests use mocks and don't need a real database connection
beforeAll(async () => {
  if (isIntegrationTest()) {
    try {
      // Connect to test database
      const testMongoUri = process.env['MONGODB_URI_TEST'] || 'mongodb://localhost:27017/paw-scan-test';
      await mongoose.connect(testMongoUri);
    } catch (error) {
      console.warn('MongoDB not available for integration tests, skipping database connection');
    }
  }
});

// Global test teardown
afterAll(async () => {
  if (isIntegrationTest() && mongoose.connection.readyState === 1) {
    // Disconnect from test database
    await mongoose.disconnect();
  }
});

// Clean up database between tests
afterEach(async () => {
  if (isIntegrationTest() && mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      if (collection) {
        try {
          await collection.deleteMany({});
        } catch (error) {
          console.warn(`Failed to clean collection ${key}:`, (error as Error).message);
        }
      }
    }
  }
}); 