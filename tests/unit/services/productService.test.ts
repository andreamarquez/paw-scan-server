import { ProductService } from '../../../src/services/productService';
import { ProductModel } from '../../../src/models/Product';
import { CreateProductData } from '../../../src/types';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  const mockProductData: CreateProductData = {
    name: 'Premium Dog Food',
    brand: 'PetCo',
    category: 'Dog Food',
    barcode: '1234567890123',
    rating: 8.5,
    reviewCount: 150,
    ingredients: ['Chicken', 'Rice', 'Vegetables'],
    nutritionalInfo: {
      protein: 25.0,
      fat: 12.0,
      fiber: 4.0,
      moisture: 10.0,
    },
    allergens: ['Chicken'],
    lifeStage: ['Adult'],
    size: ['Medium'],
    price: 29.99,
    imageUrl: 'https://example.com/image.jpg',
    description: 'High-quality premium dog food',
  };

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const mockProduct = {
        ...mockProductData,
        _id: '507f1f77bcf86cd799439011',
        createdAt: new Date(),
        updatedAt: new Date(),
        toJSON: () => ({ ...mockProductData, id: '507f1f77bcf86cd799439011' }),
      };

      jest.spyOn(ProductModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(ProductModel.prototype, 'save').mockResolvedValue(mockProduct as any);

      const result = await productService.createProduct(mockProductData);

      expect(result).toEqual({ ...mockProductData, id: '507f1f77bcf86cd799439011' });
      expect(ProductModel.findOne).toHaveBeenCalledWith({
        name: mockProductData.name,
        brand: mockProductData.brand,
      });
      expect(ProductModel.findOne).toHaveBeenCalledWith({
        barcode: mockProductData.barcode,
      });
    });

    it('should throw error if product with same name and brand exists', async () => {
      const existingProduct = { _id: '507f1f77bcf86cd799439011' };
      jest.spyOn(ProductModel, 'findOne').mockResolvedValue(existingProduct as any);

      await expect(productService.createProduct(mockProductData)).rejects.toThrow(
        'Product with this name and brand already exists'
      );
    });

    it('should throw error if product with same barcode exists', async () => {
      jest.spyOn(ProductModel, 'findOne')
        .mockResolvedValueOnce(null) // First call for name+brand check
        .mockResolvedValueOnce({ _id: '507f1f77bcf86cd799439011' } as any); // Second call for barcode check

      await expect(productService.createProduct(mockProductData)).rejects.toThrow(
        'Product with this barcode already exists'
      );
    });
  });

  describe('getProductByBarcode', () => {
    it('should return product when found', async () => {
      const mockProduct = {
        ...mockProductData,
        _id: '507f1f77bcf86cd799439011',
        toJSON: () => ({ ...mockProductData, id: '507f1f77bcf86cd799439011' }),
      };

      jest.spyOn(ProductModel, 'findOne').mockResolvedValue(mockProduct as any);

      const result = await productService.getProductByBarcode('1234567890123');

      expect(result).toEqual({ ...mockProductData, id: '507f1f77bcf86cd799439011' });
      expect(ProductModel.findOne).toHaveBeenCalledWith({ barcode: '1234567890123' });
    });

    it('should throw error when product not found', async () => {
      jest.spyOn(ProductModel, 'findOne').mockResolvedValue(null);

      await expect(productService.getProductByBarcode('1234567890123')).rejects.toThrow(
        'Product not found'
      );
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const mockProduct = {
        ...mockProductData,
        _id: '507f1f77bcf86cd799439011',
        toJSON: () => ({ ...mockProductData, id: '507f1f77bcf86cd799439011' }),
      };

      jest.spyOn(ProductModel, 'findById').mockResolvedValue(mockProduct as any);

      const result = await productService.getProductById('507f1f77bcf86cd799439011');

      expect(result).toEqual({ ...mockProductData, id: '507f1f77bcf86cd799439011' });
      expect(ProductModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw error when product not found', async () => {
      jest.spyOn(ProductModel, 'findById').mockResolvedValue(null);

      await expect(productService.getProductById('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Product not found'
      );
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { ...mockProductData, id: '507f1f77bcf86cd799439011' },
        { ...mockProductData, id: '507f1f77bcf86cd799439012', name: 'Cat Food' },
      ];

      jest.spyOn(ProductModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockProducts),
            }),
          }),
        }),
      } as any);

      jest.spyOn(ProductModel, 'countDocuments').mockResolvedValue(2);

      const result = await productService.getProducts({ page: 1, limit: 10 });

      expect(result.data).toEqual(mockProducts);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const updateData = { name: 'Updated Dog Food', rating: 9.0 };
      const mockUpdatedProduct = {
        ...mockProductData,
        ...updateData,
        _id: '507f1f77bcf86cd799439011',
        toJSON: () => ({ ...mockProductData, ...updateData, id: '507f1f77bcf86cd799439011' }),
      };

      jest.spyOn(ProductModel, 'findById').mockResolvedValue(mockUpdatedProduct as any);
      jest.spyOn(ProductModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(ProductModel, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedProduct as any);

      const result = await productService.updateProduct('507f1f77bcf86cd799439011', updateData);

      expect(result).toEqual({ ...mockProductData, ...updateData, id: '507f1f77bcf86cd799439011' });
    });

    it('should throw error when product not found', async () => {
      jest.spyOn(ProductModel, 'findById').mockResolvedValue(null);

      await expect(
        productService.updateProduct('507f1f77bcf86cd799439011', { name: 'Updated' })
      ).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const mockDeletedProduct = { _id: '507f1f77bcf86cd799439011' };
      jest.spyOn(ProductModel, 'findByIdAndDelete').mockResolvedValue(mockDeletedProduct as any);

      await expect(productService.deleteProduct('507f1f77bcf86cd799439011')).resolves.toBeUndefined();
    });

    it('should throw error when product not found', async () => {
      jest.spyOn(ProductModel, 'findByIdAndDelete').mockResolvedValue(null);

      await expect(productService.deleteProduct('507f1f77bcf86cd799439011')).rejects.toThrow(
        'Product not found'
      );
    });
  });

  describe('searchProducts', () => {
    it('should return search results', async () => {
      const mockSearchResults = [
        { ...mockProductData, id: '507f1f77bcf86cd799439011' },
      ];

      jest.spyOn(ProductModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            lean: jest.fn().mockResolvedValue(mockSearchResults),
          }),
        }),
      } as any);

      const result = await productService.searchProducts('dog food', 10);

      expect(result).toEqual(mockSearchResults);
    });
  });

  describe('getBrands', () => {
    it('should return sorted list of brands', async () => {
      const mockBrands = ['Brand C', 'Brand A', 'Brand B'];
      jest.spyOn(ProductModel, 'distinct').mockResolvedValue(mockBrands);

      const result = await productService.getBrands();

      expect(result).toEqual(['Brand A', 'Brand B', 'Brand C']);
      expect(ProductModel.distinct).toHaveBeenCalledWith('brand');
    });
  });

  describe('getProductsByBrand', () => {
    it('should return products by brand with pagination', async () => {
      const mockProducts = [
        { ...mockProductData, id: '507f1f77bcf86cd799439011' },
        { ...mockProductData, id: '507f1f77bcf86cd799439012', name: 'Cat Food' },
      ];

      jest.spyOn(ProductModel, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockProducts),
            }),
          }),
        }),
      } as any);

      jest.spyOn(ProductModel, 'countDocuments').mockResolvedValue(2);

      const result = await productService.getProductsByBrand('PetCo', { page: '1', limit: '10' });

      expect(result.data).toEqual(mockProducts);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });
  });
}); 