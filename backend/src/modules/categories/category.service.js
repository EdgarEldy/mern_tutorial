'use strict';
const categoryRepository = require('../../database/repositories/category.repository');

const getAllCategories = () => categoryRepository.findAll();

const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return category;
};

const createCategory = (data) => categoryRepository.create(data);

const updateCategory = async (id, data) => {
  await getCategoryById(id);
  await categoryRepository.update(id, data);
  return categoryRepository.findById(id);
};

const deleteCategory = async (id) => {
  await getCategoryById(id);
  return categoryRepository.destroy(id);
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
