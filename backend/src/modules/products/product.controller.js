'use strict';
const { validationResult } = require('express-validator');
const productService = require('./product.service');
const apiResponse = require('../../shared/utils/apiResponse');
const catchAsync = require('../../shared/utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();
  return apiResponse.success(res, 'Products retrieved successfully', products);
});

const getOne = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return apiResponse.success(res, 'Product retrieved successfully', product);
});

const create = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const product = await productService.createProduct(req.body);
  return apiResponse.success(res, 'Product created successfully', product, 201);
});

const update = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const product = await productService.updateProduct(req.params.id, req.body);
  return apiResponse.success(res, 'Product updated successfully', product);
});

const remove = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return apiResponse.success(res, 'Product deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
