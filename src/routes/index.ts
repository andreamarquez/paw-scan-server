import { Router } from 'express';
import productRoutes from './productRoutes';
import fs from 'fs';
import path from 'path';

const router = Router();

/**
 * Health check endpoint to verify the API is running.
 * 
 * @route GET /health
 * @returns {Object} API status information
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Paw Scan API is running',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: process.env['NODE_ENV'] || 'development',
    uptime: process.uptime(),
  });
});

/**
 * Serves the OpenAPI YAML specification file.
 * 
 * @route GET /openapi.yml
 * @returns {string} OpenAPI YAML specification
 */
router.get('/openapi.yml', (_req, res) => {
  const openApiPath = path.join(__dirname, '..', '..', 'openapi.yml');
  
  if (fs.existsSync(openApiPath)) {
    res.setHeader('Content-Type', 'application/yaml');
    res.sendFile(openApiPath);
  } else {
    res.status(404).json({
      success: false,
      error: 'OpenAPI specification not found. Run "npm run generate:openapi" to generate it.',
    });
  }
});

// API routes
router.use('/products', productRoutes);

export default router; 