import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ValidationError } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
    }));

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      validationErrors,
    });
    return;
  }
  next();
};

// Product creation validation
export const validateCreateProduct = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),
  
  body('brand')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters'),
  
  body('barcode')
    .optional()
    .trim()
    .matches(/^\d{8,14}$/)
    .withMessage('Barcode must be 8-14 digits'),
  
  body('rating')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be a number between 0 and 10'),
  
  body('reviewCount')
    .isInt({ min: 0 })
    .withMessage('Review count must be a non-negative integer'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  
  body('ingredients.*')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Ingredient must be a non-empty string'),
  
  body('nutritionalInfo.protein')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Protein must be between 0 and 100'),
  
  body('nutritionalInfo.fat')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fat must be between 0 and 100'),
  
  body('nutritionalInfo.fiber')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fiber must be between 0 and 100'),
  
  body('nutritionalInfo.moisture')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Moisture must be between 0 and 100'),
  
  body('allergens')
    .isArray()
    .withMessage('Allergens must be an array'),
  
  body('allergens.*')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Allergen must be a non-empty string'),
  
  body('lifeStage')
    .isArray({ min: 1 })
    .withMessage('At least one life stage is required'),
  
  body('lifeStage.*')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Life stage must be a non-empty string'),
  
  body('size')
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),
  
  body('size.*')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Size must be a non-empty string'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  handleValidationErrors,
];

// Product update validation
export const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Product name must be between 1 and 200 characters'),
  
  body('brand')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Brand must be between 1 and 100 characters'),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters'),
  
  body('barcode')
    .optional()
    .trim()
    .matches(/^\d{8,14}$/)
    .withMessage('Barcode must be 8-14 digits'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be a number between 0 and 10'),
  
  body('reviewCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Review count must be a non-negative integer'),
  
  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  
  body('ingredients.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Ingredient must be a non-empty string'),
  
  body('nutritionalInfo.protein')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Protein must be between 0 and 100'),
  
  body('nutritionalInfo.fat')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fat must be between 0 and 100'),
  
  body('nutritionalInfo.fiber')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fiber must be between 0 and 100'),
  
  body('nutritionalInfo.moisture')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Moisture must be between 0 and 100'),
  
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  
  body('allergens.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Allergen must be a non-empty string'),
  
  body('lifeStage')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one life stage is required'),
  
  body('lifeStage.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Life stage must be a non-empty string'),
  
  body('size')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one size is required'),
  
  body('size.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Size must be a non-empty string'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  handleValidationErrors,
];

// Barcode parameter validation
export const validateBarcode = [
  param('barcode')
    .matches(/^\d{8,14}$/)
    .withMessage('Barcode must be 8-14 digits'),
  handleValidationErrors,
];

// Product ID parameter validation
export const validateProductId = [
  param('id')
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    .withMessage('Invalid product ID format (must be a valid UUID)'),
  handleValidationErrors,
];

// Query parameters validation
export const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term cannot be empty'),
  
  query('brand')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Brand filter cannot be empty'),
  
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Min rating must be between 0 and 10'),
  
  query('maxRating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Max rating must be between 0 and 10'),
  
  handleValidationErrors,
]; 