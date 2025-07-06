import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// 1. Security middleware - Sets security headers (XSS protection, CSP, etc.)
app.use(helmet());

// 2. CORS configuration - Allows cross-origin requests with credentials
app.use(cors({
  origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  credentials: true,
}));

// 3. Rate limiting - Prevents API abuse (100 req/15min per IP)
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// 4. Logging middleware - Logs HTTP requests (disabled in tests)
if (process.env['NODE_ENV'] !== 'test') {
  app.use(morgan('combined'));
}

// 5. Body parsing middleware - Parses JSON/URL-encoded request bodies (10MB limit)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Static file serving - Serves images and files from /static directory
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// Serve OpenAPI YAML file
app.get('/openapi.yml', (_req, res) => {
  res.sendFile(path.join(__dirname, '../openapi.yml'));
});

// API documentation - serve Swagger UI with the YAML file
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerUrl: '/openapi.yml',
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Paw Scan API Documentation',
}));

// API routes
const apiVersion = process.env['API_VERSION'] || 'v1';
app.use(`/api/${apiVersion}`, routes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Paw Scan API',
    version: process.env['npm_package_version'] || '1.0.0',
    documentation: '/api-docs',
    openapi: '/openapi.yml',
    health: '/api/v1/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app; 