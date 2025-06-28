import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../types';

/**
 * Mongoose schema for pet food products.
 * Defines the complete structure, validation rules, and indexes for product documents.
 * 
 * @example
 * ```typescript
 * const product = new ProductModel({
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
 * });
 * ```
 */
const productSchema = new Schema<Product & Document>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      maxlength: [100, 'Brand name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    barcode: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return /^\d{8,14}$/.test(v);
        },
        message: 'Barcode must be 8-14 digits',
      },
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
    },
    reviewCount: {
      type: Number,
      required: [true, 'Review count is required'],
      min: [0, 'Review count must be at least 0'],
    },
    ingredients: {
      type: [String],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one ingredient is required',
      },
    },
    nutritionalInfo: {
      protein: {
        type: Number,
        required: [true, 'Protein content is required'],
        min: [0, 'Protein must be at least 0'],
        max: [100, 'Protein cannot exceed 100'],
      },
      fat: {
        type: Number,
        required: [true, 'Fat content is required'],
        min: [0, 'Fat must be at least 0'],
        max: [100, 'Fat cannot exceed 100'],
      },
      fiber: {
        type: Number,
        required: [true, 'Fiber content is required'],
        min: [0, 'Fiber must be at least 0'],
        max: [100, 'Fiber cannot exceed 100'],
      },
      moisture: {
        type: Number,
        required: [true, 'Moisture content is required'],
        min: [0, 'Moisture must be at least 0'],
        max: [100, 'Moisture cannot exceed 100'],
      },
    },
    allergens: {
      type: [String],
      required: [true, 'Allergens list is required'],
      default: [],
    },
    lifeStage: {
      type: [String],
      required: [true, 'At least one life stage is required'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one life stage is required',
      },
    },
    size: {
      type: [String],
      required: [true, 'At least one size is required'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one size is required',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be at least 0'],
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Image must be a valid URL',
      },
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_: any, ret: any) {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Indexes for better query performance
productSchema.index({ barcode: 1 }, { unique: true, sparse: true });
productSchema.index({ name: 1, brand: 1 }, { unique: true });
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ rating: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Text index for search functionality
productSchema.index({
  name: 'text',
  brand: 'text',
  category: 'text',
  ingredients: 'text',
});

/**
 * Mongoose model for pet food products.
 * Provides methods for creating, querying, updating, and deleting product documents.
 * 
 * @example
 * ```typescript
 * // Find product by barcode
 * const product = await ProductModel.findOne({ barcode: '1234567890123' });
 * 
 * // Create new product
 * const newProduct = await ProductModel.create(productData);
 * 
 * // Update product
 * const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData);
 * ```
 */
export const ProductModel = mongoose.model<Product & Document>('Product', productSchema); 