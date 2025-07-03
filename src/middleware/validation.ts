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
  
  body('barcode')
    .optional()
    .trim()
    .matches(/^\d{8,14}$/)
    .withMessage('Barcode must be 8-14 digits'),
  
  body('rating')
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be a number between 0 and 10'),
  
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  
  body('ingredients.*.name')
    .isString()
    .notEmpty()
    .withMessage('Ingredient name is required'),
  
  body('ingredients.*.status')
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Invalid ingredient status'),
  
  body('ingredients.*.description')
    .isString()
    .notEmpty()
    .withMessage('Ingredient description is required'),
  
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
  
  body('barcode')
    .optional()
    .trim()
    .matches(/^\d{8,14}$/)
    .withMessage('Barcode must be 8-14 digits'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be a number between 0 and 10'),
  
  body('ingredients')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  
  body('ingredients.*.name')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('Ingredient name is required'),
  
  body('ingredients.*.status')
    .optional()
    .isIn(['excellent', 'good', 'fair', 'poor'])
    .withMessage('Invalid ingredient status'),
  
  body('ingredients.*.description')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('Ingredient description is required'),
  
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