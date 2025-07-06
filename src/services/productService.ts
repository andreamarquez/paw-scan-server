import { ProductModel } from '../models/Product';
import { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductQuery, 
  PaginatedResponse 
} from '../types';
import { createError } from '../middleware/errorHandler';


/**
 * Service class for handling all product-related business logic.
 * Provides methods for CRUD operations, search, and data validation.
 * 
 * @example
 * ```typescript
 * const productService = new ProductService();
 * 
 * // Create a new product
 * const product = await productService.createProduct(productData);
 * 
 * // Get product by barcode
 * const product = await productService.getProductByBarcode('1234567890123');
 * ```
 */
export class ProductService {
  /**
   * Creates a new product in the database.
   * Validates that the product doesn't already exist (by name+brand and barcode).
   * 
   * @param productData - The product data to create
   * @returns Promise<Product> - The created product
   * @throws {Error} - If product with same name+brand or barcode already exists
   * 
   * @example
   * ```typescript
   * const productData = {
   *   name: 'Premium Dog Food',
   *   barcode: '1234567890123',
   *   brand: 'PetCo',
   *   rating: 8.5,
   *   image: 'https://example.com/image.jpg',
   *   ingredients: [
   *     {
   *       name: 'Chicken',
   *       status: 'excellent',
   *       description: 'High-quality chicken protein'
   *     }
   *   ]
   * };
   * 
   * const product = await productService.createProduct(productData);
   * ```
   */
  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      // Check if product with same name and brand already exists
      const existingProduct = await ProductModel.findOne({
        name: productData.name,
        brand: productData.brand,
      });

      if (existingProduct) {
        throw createError('Product with this name and brand already exists', 409);
      }

      // Check if barcode already exists (only if barcode is provided)
      if (productData.barcode) {
        const existingBarcode = await ProductModel.findOne({
          barcode: productData.barcode,
        });

        if (existingBarcode) {
          throw createError('Product with this barcode already exists', 409);
        }
      }

      const product = new ProductModel(productData);
      const savedProduct = await product.save();
      return savedProduct.toJSON();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to create product', 500);
    }
  }

  /**
   * Retrieves a product by its barcode.
   * 
   * @param barcode - The product barcode (8-14 digits)
   * @returns Promise<Product> - The found product
   * @throws {Error} - If product is not found
   * 
   * @example
   * ```typescript
   * const product = await productService.getProductByBarcode('1234567890123');
   * console.log(product.name); // 'Premium Dog Food'
   * ```
   */
  async getProductByBarcode(barcode: string): Promise<Product> {
    try {
      const product = await ProductModel.findOne({ barcode });
      if (!product) {
        throw createError('Product not found', 404);
      }
      return product.toJSON();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to retrieve product', 500);
    }
  }

  /**
   * Retrieves a product by its MongoDB ID.
   * 
   * @param id - The MongoDB ObjectId of the product
   * @returns Promise<Product> - The found product
   * @throws {Error} - If product is not found
   * 
   * @example
   * ```typescript
   * const product = await productService.getProductById('507f1f77bcf86cd799439011');
   * ```
   */
  async getProductById(id: string): Promise<Product> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        throw createError('Product not found', 404);
      }
      return product.toJSON();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to retrieve product', 500);
    }
  }

  /**
   * Retrieves a paginated list of products with optional filtering.
   * Supports search, brand filtering, and rating range filtering.
   * 
   * @param query - Query parameters for filtering and pagination
   * @returns Promise<PaginatedResponse<Product>> - Paginated list of products
   * 
   * @example
   * ```typescript
   * // Get first page of products
   * const result = await productService.getProducts({ page: 1, limit: 10 });
   * 
   * // Search for products
   * const result = await productService.getProducts({ 
   *   search: 'premium', 
   *   brand: 'PetCo',
   *   minRating: 7,
   *   maxRating: 9
   * });
   * ```
   */
  async getProducts(query: ProductQuery): Promise<PaginatedResponse<Product>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        brand,
        minRating,
        maxRating,
      } = query;

      const skip = (page - 1) * limit;
      const filter: any = {};

      // Add search filter
      if (search) {
        filter.$text = { $search: search };
      }

      // Add brand filter
      if (brand) {
        filter.brand = { $regex: brand, $options: 'i' };
      }

      // Add rating range filter
      if (minRating !== undefined || maxRating !== undefined) {
        filter.rating = {};
        if (minRating !== undefined) filter.rating.$gte = minRating;
        if (maxRating !== undefined) filter.rating.$lte = maxRating;
      }

      const [products, total] = await Promise.all([
        ProductModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      throw createError('Failed to retrieve products', 500);
    }
  }

  /**
   * Updates an existing product by ID.
   * Validates that updated fields don't conflict with existing products.
   * 
   * @param id - The MongoDB ObjectId of the product to update
   * @param updateData - The fields to update (all optional)
   * @returns Promise<Product> - The updated product
   * @throws {Error} - If product is not found or conflicts exist
   * 
   * @example
   * ```typescript
   * const updatedProduct = await productService.updateProduct(
   *   '507f1f77bcf86cd799439011',
   *   { name: 'Updated Dog Food', rating: 9.0 }
   * );
   * ```
   */
  async updateProduct(id: string, updateData: UpdateProductData): Promise<Product> {
    try {
      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        throw createError('Product not found', 404);
      }

      // If updating name and brand, check for duplicates
      if (updateData.name && updateData.brand) {
        const duplicateProduct = await ProductModel.findOne({
          name: updateData.name,
          brand: updateData.brand,
          _id: { $ne: id },
        });

        if (duplicateProduct) {
          throw createError('Product with this name and brand already exists', 409);
        }
      }

      // If updating barcode, check for duplicates
      if (updateData.barcode) {
        const duplicateBarcode = await ProductModel.findOne({
          barcode: updateData.barcode,
          _id: { $ne: id },
        });

        if (duplicateBarcode) {
          throw createError('Product with this barcode already exists', 409);
        }
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw createError('Product not found', 404);
      }

      return updatedProduct.toJSON();
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to update product', 500);
    }
  }

  /**
   * Deletes a product by its MongoDB ID.
   * 
   * @param id - The MongoDB ObjectId of the product to delete
   * @returns Promise<void>
   * @throws {Error} - If product is not found
   * 
   * @example
   * ```typescript
   * await productService.deleteProduct('507f1f77bcf86cd799439011');
   * ```
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw createError('Product not found', 404);
      }
    } catch (error) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error;
      }
      throw createError('Failed to delete product', 500);
    }
  }

  /**
   * Performs full-text search across product names, brands, and ingredient names.
   * Results are sorted by relevance score.
   * 
   * @param searchTerm - The search term to look for
   * @param limit - Maximum number of results to return (default: 10)
   * @returns Promise<Product[]> - Array of matching products
   * 
   * @example
   * ```typescript
   * const results = await productService.searchProducts('premium chicken', 5);
   * ```
   */
  async searchProducts(searchTerm: string, limit: number = 10): Promise<Product[]> {
    try {
      const products = await ProductModel.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .lean();

      return products;
    } catch (error) {
      throw createError('Failed to search products', 500);
    }
  }


} 