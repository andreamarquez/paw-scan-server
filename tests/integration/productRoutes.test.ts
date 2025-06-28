import request from 'supertest';
import app from '../../src/app';
import { ProductModel } from '../../src/models/Product';
import { CreateProductData } from '../../src/types';

describe('Product Routes Integration Tests', () => {
  const baseUrl = '/api/v1/products';

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

  beforeEach(async () => {
    await ProductModel.deleteMany({});
  });

  describe('POST /products', () => {
    it('should create a new product successfully', async () => {
      const response = await request(app)
        .post(baseUrl)
        .send(mockProductData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(mockProductData.name);
      expect(response.body.data.barcode).toBe(mockProductData.barcode);
      expect(response.body.data.brand).toBe(mockProductData.brand);
      expect(response.body.data.rating).toBe(mockProductData.rating);
      expect(response.body.data.ingredients).toHaveLength(3);
      expect(response.body.message).toBe('Product created successfully');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '',
        brand: '',
        category: '',
        rating: 15,
        reviewCount: -1,
        ingredients: [],
        nutritionalInfo: {
          protein: -1,
          fat: 150,
          fiber: -5,
          moisture: 200,
        },
        allergens: [],
        lifeStage: [],
        size: [],
        price: -10,
      };

      const response = await request(app)
        .post(baseUrl)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.validationErrors).toBeDefined();
    });

    it('should return error for duplicate product', async () => {
      // Create first product
      await request(app).post(baseUrl).send(mockProductData).expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post(baseUrl)
        .send(mockProductData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Product with this name and brand already exists');
    });
  });

  describe('GET /products/:barcode', () => {
    it('should return product by barcode', async () => {
      // Create product first
      await request(app)
        .post(baseUrl)
        .send(mockProductData)
        .expect(201);

      const barcode = mockProductData.barcode;
      const response = await request(app)
        .get(`${baseUrl}/${barcode}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.barcode).toBe(barcode);
      expect(response.body.data.name).toBe(mockProductData.name);
    });

    it('should return 404 for non-existent barcode', async () => {
      const response = await request(app)
        .get(`${baseUrl}/9999999999999`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return validation error for invalid barcode format', async () => {
      const response = await request(app)
        .get(`${baseUrl}/invalid-barcode`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /products', () => {
    beforeEach(async () => {
      // Create multiple products for testing
      const products = [
        { ...mockProductData, name: 'Dog Food 1', barcode: '1234567890123' },
        { ...mockProductData, name: 'Dog Food 2', barcode: '1234567890124', brand: 'PetSmart' },
        { ...mockProductData, name: 'Cat Food', barcode: '1234567890125', brand: 'PetCo' },
      ];

      for (const product of products) {
        await request(app).post(baseUrl).send(product);
      }
    });

    it('should return paginated products', async () => {
      const response = await request(app)
        .get(baseUrl)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(2);
      expect(response.body.data.pagination.total).toBe(3);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    it('should filter products by brand', async () => {
      const response = await request(app)
        .get(baseUrl)
        .query({ brand: 'PetCo' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.data.every((p: any) => p.brand === 'PetCo')).toBe(true);
    });

    it('should filter products by rating range', async () => {
      const response = await request(app)
        .get(baseUrl)
        .query({ minRating: 8.0, maxRating: 9.0 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data.every((p: any) => p.rating >= 8.0 && p.rating <= 9.0)).toBe(true);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update product successfully', async () => {
      // Create product first
      const createResponse = await request(app)
        .post(baseUrl)
        .send(mockProductData)
        .expect(201);

      const productId = createResponse.body.data.id;
      const updateData = {
        name: 'Updated Dog Food',
        rating: 9.0,
      };

      const response = await request(app)
        .put(`${baseUrl}/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.rating).toBe(updateData.rating);
      expect(response.body.message).toBe('Product updated successfully');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      
      const response = await request(app)
        .put(`${baseUrl}/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product successfully', async () => {
      // Create product first
      const createResponse = await request(app)
        .post(baseUrl)
        .send(mockProductData)
        .expect(201);

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`${baseUrl}/${productId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully');

      // Verify product is deleted
      await request(app)
        .get(`${baseUrl}/id/${productId}`)
        .expect(404);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      
      const response = await request(app)
        .delete(`${baseUrl}/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('GET /products/brands', () => {
    beforeEach(async () => {
      // Create products with different brands
      const products = [
        { ...mockProductData, name: 'Product 1', barcode: '1234567890123', brand: 'Brand C' },
        { ...mockProductData, name: 'Product 2', barcode: '1234567890124', brand: 'Brand A' },
        { ...mockProductData, name: 'Product 3', barcode: '1234567890125', brand: 'Brand B' },
      ];

      for (const product of products) {
        await request(app).post(baseUrl).send(product);
      }
    });

    it('should return sorted list of brands', async () => {
      const response = await request(app)
        .get(`${baseUrl}/brands`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(['Brand A', 'Brand B', 'Brand C']);
    });
  });

  describe('GET /products/brand/:brand', () => {
    beforeEach(async () => {
      // Create products with different brands
      const products = [
        { ...mockProductData, name: 'Product 1', barcode: '1234567890123', brand: 'PetCo' },
        { ...mockProductData, name: 'Product 2', barcode: '1234567890124', brand: 'PetCo' },
        { ...mockProductData, name: 'Product 3', barcode: '1234567890125', brand: 'PetSmart' },
      ];

      for (const product of products) {
        await request(app).post(baseUrl).send(product);
      }
    });

    it('should return products by brand', async () => {
      const response = await request(app)
        .get(`${baseUrl}/brand/PetCo`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.data.every((p: any) => p.brand === 'PetCo')).toBe(true);
    });

    it('should return empty array for non-existent brand', async () => {
      const response = await request(app)
        .get(`${baseUrl}/brand/NonExistentBrand`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data).toHaveLength(0);
    });
  });
}); 