import { Response } from 'express';
import { ProductService } from '../services/productService';
import { 
  ProductRequest,
  BarcodeRequest,
  BrandRequest,
  ProductQueryRequest,
  CreateProductRequest,
  UpdateProductRequest
} from '../types';

const productService = new ProductService();

/**
 * Controller object containing all product-related API endpoint handlers.
 * Uses typed request interfaces for better type safety.
 */
export const productController = {
  /**
   * Get all products with optional filtering and pagination
   * @param req - Express request object with query parameters
   * @param res - Express response object
   */
  getProducts: async (req: ProductQueryRequest, res: Response): Promise<void> => {
    try {
      const query: any = {
        page: req.query.page ? parseInt(req.query.page) : 1,
        limit: req.query.limit ? parseInt(req.query.limit) : 10,
      };
      
      if (req.query.search) query.search = req.query.search;
      if (req.query.brand) query.brand = req.query.brand;
      if (req.query.minRating) query.minRating = parseFloat(req.query.minRating);
      if (req.query.maxRating) query.maxRating = parseFloat(req.query.maxRating);
      
      const result = await productService.getProducts(query);
      res.json({
        success: true,
        data: result,
        pagination: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get a single product by ID
   * @param req - Express request object with product ID parameter
   * @param res - Express response object
   */
  getProductById: async (req: ProductRequest, res: Response): Promise<void> => {
    try {
      const product = await productService.getProductById(req.params.id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      const message = error instanceof Error && 'statusCode' in error ? error.message : 'Failed to fetch product';
      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  },

  /**
   * Get a product by barcode
   * @param req - Express request object with barcode parameter
   * @param res - Express response object
   */
  getProductByBarcode: async (req: BarcodeRequest, res: Response): Promise<void> => {
    try {
      const product = await productService.getProductByBarcode(req.params.barcode);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      const message = error instanceof Error && 'statusCode' in error ? error.message : 'Failed to fetch product by barcode';
      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  },

  /**
   * Create a new product
   * @param req - Express request object with product data in body
   * @param res - Express response object
   */
  createProduct: async (req: CreateProductRequest, res: Response): Promise<void> => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      res.status(statusCode).json({
        success: false,
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Update an existing product
   * @param req - Express request object with product ID parameter and update data in body
   * @param res - Express response object
   */
  updateProduct: async (req: UpdateProductRequest, res: Response): Promise<void> => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Product not found'
        });
        return;
      }

      res.json({
        success: true,
        data: product,
        message: 'Product updated successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      const message = error instanceof Error && 'statusCode' in error ? error.message : 'Failed to update product';
      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  },

  /**
   * Delete a product
   * @param req - Express request object with product ID parameter
   * @param res - Express response object
   */
  deleteProduct: async (req: ProductRequest, res: Response): Promise<void> => {
    try {
      await productService.deleteProduct(req.params.id);
      
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      const statusCode = error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500;
      const message = error instanceof Error && 'statusCode' in error ? error.message : 'Failed to delete product';
      res.status(statusCode).json({
        success: false,
        message: message
      });
    }
  },

  /**
   * Get all unique brands
   * @param req - Express request object
   * @param res - Express response object
   */
  getBrands: async (_req: ProductQueryRequest, res: Response): Promise<void> => {
    try {
      const brands = await productService.getBrands();
      res.json({
        success: true,
        data: brands
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch brands',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get products by brand
   * @param req - Express request object with brand parameter
   * @param res - Express response object
   */
  getProductsByBrand: async (req: BrandRequest & ProductQueryRequest, res: Response): Promise<void> => {
    try {
      const result = await productService.getProductsByBrand(req.params.brand, req.query);
      res.json({
        success: true,
        data: result,
        pagination: {
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products by brand',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}; 