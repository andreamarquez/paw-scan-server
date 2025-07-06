/**
 * Represents the quality status of an ingredient in a pet food product.
 * @typedef {'excellent' | 'good' | 'fair' | 'poor'} IngredientStatus
 */
export type IngredientStatus = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Represents an ingredient in a pet food product with its quality assessment.
 * @interface Ingredient
 */
export interface Ingredient {
  id?: string;
  name: string;
  status: IngredientStatus;
  description: string;
}

/**
 * Represents a complete pet food product with all its details and ratings.
 * @interface Product
 */
export interface Product {
  id: string; // UUID
  name: string;
  barcode?: string;
  brand: string;
  rating: number;
  ingredients: Ingredient[];
  imageUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request payload for creating a new product.
 * @interface CreateProductRequest
 */
export interface CreateProductData {
  name: string;
  brand: string;
  barcode?: string;
  rating: number;
  ingredients: Ingredient[];
  imageUrl?: string;
  description?: string;
}

/**
 * Request payload for updating an existing product.
 * All fields are optional as only provided fields will be updated.
 * @interface UpdateProductRequest
 */
export interface UpdateProductData {
  name?: string;
  brand?: string;
  barcode?: string;
  rating?: number;
  ingredients?: Ingredient[];
  imageUrl?: string;
  description?: string;
}

/**
 * Query parameters for filtering and paginating product lists.
 * @interface ProductQuery
 */
export interface ProductQuery {
  /** Page number for pagination (default: 1) */
  page?: number;
  /** Number of items per page (default: 10, max: 100) */
  limit?: number;
  /** Search term for full-text search across product names, brands, and ingredients */
  search?: string;
  /** Filter products by specific brand */
  brand?: string;
  /** Minimum rating filter (0-10) */
  minRating?: number;
  /** Maximum rating filter (0-10) */
  maxRating?: number;
}

/**
 * Generic paginated response wrapper for API endpoints that return lists.
 * @template T - The type of items in the data array
 * @interface PaginatedResponse
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items across all pages */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Standard API response wrapper for all endpoints.
 * @template T - The type of data being returned
 * @interface ApiResponse
 */
export interface ApiResponse<T> {
  /** Indicates if the request was successful */
  success: boolean;
  /** The response data (only present on success) */
  data?: T;
  /** Success message (only present on success) */
  message?: string;
  /** Error message (only present on error) */
  error?: string;
}

/**
 * Represents a validation error for a specific field.
 * @interface ValidationError
 */
export interface ValidationError {
  /** The field name that failed validation */
  field: string;
  /** The validation error message */
  message: string;
}

export interface ProductQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  brand?: string;
  category?: string;
  minRating?: string;
  maxRating?: string;
  minPrice?: string;
  maxPrice?: string;
  allergens?: string;
  lifeStage?: string;
  size?: string;
}

export interface ProductParams {
  id: string;
}

export interface BarcodeParams {
  barcode: string;
}

export interface BrandParams {
  brand: string;
}

import { Request } from 'express';

// Custom request interfaces for better type safety
export interface ProductRequest extends Request {
  params: {
    id: string;
  };
}

export interface BarcodeRequest extends Request {
  params: {
    barcode: string;
  };
}

export interface BrandRequest extends Request {
  params: {
    brand: string;
  };
}

export interface ProductQueryRequest extends Request {
  query: ProductQueryParams & { [key: string]: string | string[] | undefined };
}

export interface CreateProductRequest extends Request {
  body: CreateProductData;
}

export interface UpdateProductRequest extends Request {
  params: {
    id: string;
  };
  body: UpdateProductData;
} 