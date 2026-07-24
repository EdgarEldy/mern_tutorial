'use strict';
const categoryService = require('../../src/modules/categories/category.service');
const categoryRepository = require('../../src/database/repositories/category.repository');

jest.mock('../../src/database/repositories/category.repository');

describe('categoryService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllCategories', () => {
    it('delegates to the repository and returns the result', async () => {
      const rows = [{ id: 1, category_name: 'Electronics' }];
      categoryRepository.findAll.mockResolvedValue(rows);

      const result = await categoryService.getAllCategories();

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rows);
    });
  });

  describe('getCategoryById', () => {
    it('returns the category when the repository finds it', async () => {
      const row = { id: 1, category_name: 'Electronics' };
      categoryRepository.findById.mockResolvedValue(row);

      const result = await categoryService.getCategoryById(1);

      expect(categoryRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(row);
    });

    it('throws a 404 error when the category does not exist', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(categoryService.getCategoryById(99)).rejects.toMatchObject({
        message: 'Category not found',
        statusCode: 404,
      });
    });
  });

  describe('createCategory', () => {
    it('passes the payload to the repository and returns the created row', async () => {
      const payload = { category_name: 'Books' };
      const created = { id: 3, ...payload };
      categoryRepository.create.mockResolvedValue(created);

      const result = await categoryService.createCategory(payload);

      expect(categoryRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });
  });

  describe('updateCategory', () => {
    it('updates the row and returns the refreshed category', async () => {
      const before = { id: 1, category_name: 'Electronics' };
      const after = { id: 1, category_name: 'Electronics & Gadgets' };
      categoryRepository.findById
        .mockResolvedValueOnce(before)
        .mockResolvedValueOnce(after);
      categoryRepository.update.mockResolvedValue([1]);

      const result = await categoryService.updateCategory(1, { category_name: 'Electronics & Gadgets' });

      expect(categoryRepository.update).toHaveBeenCalledWith(1, { category_name: 'Electronics & Gadgets' });
      expect(result).toEqual(after);
    });

    it('throws 404 when the category does not exist', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(
        categoryService.updateCategory(99, { category_name: 'X' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteCategory', () => {
    it('calls destroy on the repository when the category exists', async () => {
      categoryRepository.findById.mockResolvedValue({ id: 1 });
      categoryRepository.destroy.mockResolvedValue(1);

      await categoryService.deleteCategory(1);

      expect(categoryRepository.destroy).toHaveBeenCalledWith(1);
    });

    it('throws 404 when the category does not exist', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(categoryService.deleteCategory(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
