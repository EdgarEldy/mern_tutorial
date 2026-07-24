'use strict';
const productService = require('../../src/modules/products/product.service');
const productRepository = require('../../src/database/repositories/product.repository');

jest.mock('../../src/database/repositories/product.repository');

describe('productService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllProducts', () => {
    it('delegates to the repository and returns the result', async () => {
      const rows = [{ id: 1, product_name: 'Laptop', unit_price: 999.99 }];
      productRepository.findAll.mockResolvedValue(rows);

      const result = await productService.getAllProducts();

      expect(productRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rows);
    });
  });

  describe('getProductById', () => {
    it('returns the product when found', async () => {
      const row = { id: 1, product_name: 'Laptop', unit_price: 999.99 };
      productRepository.findById.mockResolvedValue(row);

      const result = await productService.getProductById(1);

      expect(productRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(row);
    });

    it('throws a 404 error when the product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(productService.getProductById(99)).rejects.toMatchObject({
        message: 'Product not found',
        statusCode: 404,
      });
    });
  });

  describe('createProduct', () => {
    it('passes the payload to the repository and returns the created row', async () => {
      const payload = { product_name: 'Mouse', unit_price: 29.99, category_id: 1 };
      const created = { id: 2, ...payload };
      productRepository.create.mockResolvedValue(created);

      const result = await productService.createProduct(payload);

      expect(productRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });
  });

  describe('updateProduct', () => {
    it('updates and returns the refreshed product', async () => {
      const before = { id: 1, product_name: 'Laptop', unit_price: 999.99 };
      const after = { id: 1, product_name: 'Gaming Laptop', unit_price: 1299.99 };
      productRepository.findById
        .mockResolvedValueOnce(before)
        .mockResolvedValueOnce(after);
      productRepository.update.mockResolvedValue([1]);

      const result = await productService.updateProduct(1, { product_name: 'Gaming Laptop', unit_price: 1299.99 });

      expect(productRepository.update).toHaveBeenCalledWith(1, { product_name: 'Gaming Laptop', unit_price: 1299.99 });
      expect(result).toEqual(after);
    });

    it('throws 404 when the product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(
        productService.updateProduct(99, { product_name: 'X' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteProduct', () => {
    it('calls destroy on the repository when the product exists', async () => {
      productRepository.findById.mockResolvedValue({ id: 1 });
      productRepository.destroy.mockResolvedValue(1);

      await productService.deleteProduct(1);

      expect(productRepository.destroy).toHaveBeenCalledWith(1);
    });

    it('throws 404 when the product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(productService.deleteProduct(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
