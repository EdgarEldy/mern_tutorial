'use strict';
const { validationResult } = require('express-validator');
const categoryService = require('./category.service');
const apiResponse = require('../../shared/utils/apiResponse');
const catchAsync = require('../../shared/utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return apiResponse.success(res, 'Categories retrieved successfully', categories);
});

const getOne = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return apiResponse.success(res, 'Category retrieved successfully', category);
});

const create = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const category = await categoryService.createCategory(req.body);
  return apiResponse.success(res, 'Category created successfully', category, 201);
});

const update = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const category = await categoryService.updateCategory(req.params.id, req.body);
  return apiResponse.success(res, 'Category updated successfully', category);
});

const remove = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return apiResponse.success(res, 'Category deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
