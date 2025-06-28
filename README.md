# 🐾 Paw Scan Server

A modern Node.js/TypeScript backend API for the **Paw Scan** pet food rating application. This server provides a comprehensive REST API for managing pet food products, including barcode scanning, product ratings, and ingredient analysis.

## 📋 Project Context

**Paw Scan** is a pet food rating application similar to Yuka (for human food), but designed specifically for pets. The app helps pet owners make informed decisions about their pets' nutrition by:

- 📱 **Barcode Scanning**: Scan pet food products to get instant ratings
- ⭐ **Product Ratings**: Rate products on a 0-10 scale based on ingredient quality
- 🥘 **Ingredient Analysis**: Detailed breakdown of ingredients with quality status
- 🔍 **Search & Filter**: Find products by brand, rating, or search terms
- 📊 **Nutritional Insights**: Understand what's good and what to avoid

This backend server powers the iOS mobile app (built in Swift) and provides all the necessary APIs for product management and data retrieval.

## 🚀 Features

### Core Functionality
- **Product Management**: Full CRUD operations for pet food products
- **Barcode Lookup**: Instant product retrieval by barcode scanning
- **Ingredient Analysis**: Quality assessment of individual ingredients
- **Search & Filter**: Advanced search with multiple filter options
- **Pagination**: Efficient data pagination for large datasets

### Technical Features
- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB**: NoSQL database with optimized indexes
- **Express.js**: Fast, unopinionated web framework
- **OpenAPI/Swagger**: Interactive API documentation
- **Comprehensive Testing**: Unit and integration tests
- **Security**: CORS, Helmet, Rate Limiting, Input Validation
- **CI/CD**: GitHub Actions with automated testing and deployment

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 24.x | Runtime environment |
| **TypeScript** | 5.4.x | Type-safe JavaScript |
| **Express.js** | 4.18.x | Web framework |
| **MongoDB** | 6.0+ | NoSQL database |
| **Mongoose** | 8.2.x | MongoDB ODM |
| **Jest** | 29.7.x | Testing framework |
| **ESLint** | 8.57.x | Code linting |
| **Prettier** | 3.3.x | Code formatting |
| **Swagger** | 6.2.x | API documentation |

## 📦 Prerequisites

Before running this project, ensure you have:

- **Node.js 24.x** or higher (use `.nvmrc` file)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager

### Installing Node.js 24

Using nvm (recommended):
```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 24
nvm install 24
nvm use 24
```

Or download directly from [nodejs.org](https://nodejs.org/)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd paw-scan-server

# Install dependencies
npm install
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration (REQUIRED - no defaults)
MONGO_USER=your_secure_username
MONGO_PASSWORD=your_secure_password
MONGO_TEST_USER=your_test_username
MONGO_TEST_PASSWORD=your_test_password
MONGO_ADMIN_USERNAME=your_admin_username
MONGO_ADMIN_PASSWORD=your_admin_password

# Connection Strings
MONGODB_URI=mongodb://{MONGO_USER}:{MONGO_PASSWORD}@localhost:27017/paw_scan?authSource=paw_scan
MONGODB_URI_TEST=mongodb://{MONGO_TEST_USER}:{MONGO_TEST_PASSWORD}@localhost:27018/paw_scan_test?authSource=paw_scan_test

# API Configuration
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

### 3. Setup MongoDB Init Scripts
```bash
# Generate secure MongoDB initialization scripts
./scripts/setup-mongo-init.sh
```

### 4. Start MongoDB
```bash
# Start MongoDB with Docker Compose
npm run docker:up

# Or use the simple dev setup (no authentication)
npm run dev:simple
```

### 5. Run the Application
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 🐳 Docker Compose Setup

This project includes Docker Compose configuration for easy development and testing with MongoDB.

### Prerequisites for Docker
- **Docker** and **Docker Compose** installed
- **Node.js 24.x** (for running the application)

### Development with Docker Compose

#### 1. Start MongoDB Services
```bash
# Start MongoDB and Mongo Express
npm run docker:up

# Or manually with docker-compose
docker-compose up -d
```

This will start:
- **MongoDB** on port `27017` with authentication
- **Mongo Express** (web UI) on port `8081` for database management

#### 2. Access Services
- **MongoDB**: `mongodb://{MONGO_USER}:{MONGO_PASSWORD}@localhost:27017/paw_scan?authSource=paw_scan`
- **Mongo Express**: `http://localhost:8081` (admin/password123)

#### 3. Environment Configuration for Docker
Update your `.env` file:
```env
# Development with Docker Compose
MONGODB_URI=mongodb://{MONGO_USER}:{MONGO_PASSWORD}@localhost:27017/paw_scan?authSource=paw_scan
MONGODB_URI_TEST=mongodb://paw_scan_test_user:paw_scan_test_password@localhost:27018/paw_scan_test?authSource=paw_scan_test
```

#### 4. Run Application with Docker
```bash
# Start MongoDB and run the app in development mode
npm run dev:docker

# Or start them separately
npm run docker:up
npm run dev
```

### Testing with Docker Compose

#### 1. Run Tests with Docker MongoDB
```bash
# Start test MongoDB, run tests, and cleanup
npm run test:docker

# Or manually
npm run docker:test:up
npm test
npm run docker:test:down
```

#### 2. Test Environment
- **Test MongoDB**: `mongodb://paw_scan_test_user:paw_scan_test_password@localhost:27018/paw_scan_test?authSource=paw_scan_test`
- **Port**: `27018` (different from development to avoid conflicts)

### Docker Compose Commands

#### Development Commands
```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# Restart services
npm run docker:restart

# View logs
npm run docker:logs

# Clean up (removes volumes)
npm run docker:clean
```

#### Testing Commands
```bash
# Start test services
npm run docker:test:up

# Stop test services
npm run docker:test:down

# Clean up test services
npm run docker:test:clean
```

### Docker Compose Services

#### Development (`docker-compose.yml`)
- **mongodb**: MongoDB 7.0 with authentication and persistence
- **mongo-express**: Web-based MongoDB admin interface

#### Testing (`docker-compose.test.yml`)
- **mongodb-test**: MongoDB 7.0 for testing (no persistence)

### Database Initialization

The Docker Compose setup includes automatic database initialization:

#### Development Database
- **Database**: `paw_scan`
- **User**: `MONGO_USER` / `MONGO_PASSWORD`
- **Collections**: `products` with validation and indexes
- **Admin**: `admin` / `password123`

#### Test Database
- **Database**: `paw_scan_test`
- **User**: `paw_scan_test_user` / `paw_scan_test_password`
- **Collections**: `products` with basic indexes

### Troubleshooting

#### MongoDB Connection Issues
```bash
# Check if MongoDB is running
docker ps

# Check MongoDB logs
docker logs paw-scan-mongodb

# Restart MongoDB
docker restart paw-scan-mongodb
```

#### Port Conflicts
If you get port conflicts:
```bash
# Check what's using the ports
lsof -i :27017
lsof -i :8081

# Stop conflicting services or change ports in docker-compose.yml
```

#### Reset Database
```bash
# Remove all data and start fresh
npm run docker:clean
npm run docker:up
```

## 📄 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI YAML**: `http://localhost:3000/openapi.yml`

### Base URL
```
http://localhost:3000/api/v1
```

### Core Endpoints

#### 🏥 Health Check
```http
GET /
```
**Response:**
```json
{
  "success": true,
  "message": "Paw Scan API",
  "version": "1.0.0",
  "documentation": "/api-docs"
}
```

#### 📱 Product by Barcode
```http
GET /products/{barcode}
```
**Example:**
```bash
curl http://localhost:3000/api/v1/products/1234567890123
```

#### 📋 List Products (with filters)
```http
GET /products?page=1&limit=10&search=premium&brand=PetCo&minRating=7&maxRating=9
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Full-text search term
- `brand`: Filter by brand name
- `minRating`: Minimum rating filter (0-10)
- `maxRating`: Maximum rating filter (0-10)

#### ➕ Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Premium Dog Food",
  "barcode": "1234567890123",
  "brand": "PetCo",
  "rating": 8.5,
  "image": "https://example.com/image.jpg",
  "ingredients": [
    {
      "name": "Chicken",
      "status": "excellent",
      "description": "High-quality chicken protein"
    },
    {
      "name": "Rice",
      "status": "good",
      "description": "Whole grain rice"
    }
  ]
}
```

#### 🔄 Update Product
```http
PUT /products/{id}
Content-Type: application/json

{
  "name": "Updated Dog Food",
  "rating": 9.0
}
```

#### 🗑️ Delete Product
```http
DELETE /products/{id}
```

#### 🔍 Search Products
```http
GET /products/search?q=premium&limit=10
```

#### 🏷️ Get All Brands
```http
GET /products/brands
```

## 🗄️ Data Models

### Product Schema
```typescript
interface Product {
  id: string;                    // Unique identifier
  name: string;                  // Product name (1-200 chars)
  barcode: string;               // Barcode (8-14 digits, unique)
  brand: string;                 // Brand name (1-100 chars)
  rating: number;                // Overall rating (0-10)
  image: string;                 // Product image URL
  ingredients: Ingredient[];     // List of ingredients
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Ingredient Schema
```typescript
interface Ingredient {
  name: string;                  // Ingredient name
  status: 'excellent' | 'good' | 'fair' | 'poor';  // Quality status
  description: string;           // Description and benefits/concerns
}
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Test Structure
- **Unit Tests**: `tests/unit/` - Test individual functions and classes
- **Integration Tests**: `tests/integration/` - Test API endpoints
- **Test Setup**: `tests/setup.ts` - Global test configuration

### Test Database
Tests use a separate MongoDB database (`paw-scan-test`) to avoid affecting development data.

## 🛠 Development

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
npm run generate:openapi # Generate OpenAPI YAML file
npm run docs:serve   # Serve OpenAPI documentation
```

### Code Quality
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking
- **JSDoc**: Comprehensive documentation

### Database Indexes
The following indexes are automatically created for optimal performance:
- `barcode` (unique)
- `name + brand` (unique)
- `brand`
- `rating`
- `createdAt`
- Text index on `name`, `brand`, and `ingredients.name`

## 🔒 Security Features

- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Rate Limiting**: Request rate limiting per IP (100 requests per 15 minutes)
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Secure error responses (no stack traces in production)
- **MongoDB Injection Protection**: Mongoose provides built-in protection

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-production-mongodb-uri
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_MAX_REQUESTS=1000
```

### Docker Deployment
```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Build and Deploy
```bash
# Build the application
npm run build

# Generate OpenAPI documentation
npm run generate:openapi

# Start production server
npm start
```

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows that:

1. **Test**: Run tests on Node.js 24 with MongoDB
2. **Lint**: Check code quality with ESLint
3. **Build**: Build the application
4. **Generate Docs**: Create OpenAPI documentation
5. **Security**: Run security audits
6. **Deploy**: Upload build artifacts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add JSDoc comments for all functions
- Write tests for new features
- Ensure all tests pass
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the API docs at `/api-docs`
- **Issues**: Create an issue in the repository
- **Questions**: Open a discussion in the repository

## 🔗 Related Projects

- **Paw Scan Mobile**: iOS app built with Swift
- **Paw Scan Web**: Web interface (future project)

## 🔒 Security & Credentials Management

This project implements secure credential management to prevent hardcoded passwords in version control.

### MongoDB Credentials Security

#### 1. Environment Variables (Required)
All MongoDB credentials **must** be set in environment variables. There are no defaults for security reasons:

```env
# MongoDB Credentials (REQUIRED - no defaults)
MONGO_USER=your_secure_username
MONGO_PASSWORD=your_secure_password
MONGO_TEST_USER=your_test_username
MONGO_TEST_PASSWORD=your_test_password

# MongoDB Admin credentials (REQUIRED - no defaults)
MONGO_ADMIN_USERNAME=your_admin_username
MONGO_ADMIN_PASSWORD=your_admin_password
```

#### 2. Secure Setup Process

**Step 1: Create Environment File**
```bash
# Copy the example environment file
cp env.example .env

# Edit with your secure credentials (REQUIRED)
nano .env
```

**Step 2: Generate MongoDB Init Script**
```bash
# Run the secure setup script
./scripts/setup-mongo-init.sh
```

This script:
- ✅ Validates that all required environment variables are set
- ✅ Creates `mongo-init.js` from the template
- ✅ Uses credentials from your `.env` file
- ✅ Ensures the file is not committed to git
- ❌ **Fails if any required variables are missing**

**Step 3: Start Services**
```bash
# Start MongoDB with authentication
npm run docker:up
```

#### 3. GitHub Secrets (Production)

For production deployments, store credentials as GitHub Secrets:

```bash
# In your GitHub repository settings:
MONGO_USER=your_production_user
MONGO_PASSWORD=your_secure_password
MONGO_ADMIN_USERNAME=your_admin_user
MONGO_ADMIN_PASSWORD=your_admin_password
```

#### 4. Files Security

- ✅ `mongo-init.js` - **Excluded from git** (contains credentials)
- ✅ `mongo-init.template.js` - **Included in git** (template only)
- ✅ `.env` - **Excluded from git** (contains credentials)
- ✅ `env.example` - **Included in git** (template only)

#### 5. Security Enforcement

- ❌ **No default values** in Docker Compose files
- ❌ **No fallback credentials** in templates
- ✅ **Environment variables required** for all operations
- ✅ **Setup script validates** all required variables
- ✅ **Docker containers fail** if credentials are missing

### Development with Docker Compose

#### 1. Start MongoDB Services
```bash
# Start MongoDB and Mongo Express
npm run docker:up

# Or manually with docker-compose
docker-compose up -d
```

This will start:
- **MongoDB** on port `27017` with authentication
- **Mongo Express** (web UI) on port `8081` for database management

#### 2. Access Services
- **MongoDB**: `mongodb://MONGO_USER:MONGO_PASSWORD@localhost:27017/paw_scan?authSource=paw_scan`
- **Mongo Express**: `http://localhost:8081` (admin/password123)

#### 3. Environment Configuration for Docker
Update your `.env` file:
```env
# Development with Docker Compose
MONGODB_URI=mongodb://MONGO_USER:MONGO_PASSWORD@localhost:27017/paw_scan?authSource=paw_scan
MONGODB_URI_TEST=mongodb://paw_scan_test_user:paw_scan_test_password@localhost:27018/paw_scan_test?authSource=paw_scan_test
```

#### 4. Run Application with Docker
```bash
# Start MongoDB and run the app in development mode
npm run dev:docker

# Or start them separately
npm run docker:up
npm run dev
```

---

**Built with ❤️ for pet parents everywhere** 