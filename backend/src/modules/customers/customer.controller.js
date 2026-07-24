'use strict';
const { validationResult } = require('express-validator');
const customerService = require('./customer.service');
const apiResponse = require('../../shared/utils/apiResponse');
const catchAsync = require('../../shared/utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const customers = await customerService.getAllCustomers();
  return apiResponse.success(res, 'Customers retrieved successfully', customers);
});

const getOne = catchAsync(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  return apiResponse.success(res, 'Customer retrieved successfully', customer);
});

const create = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const customer = await customerService.createCustomer(req.body);
  return apiResponse.success(res, 'Customer created successfully', customer, 201);
});

const update = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  return apiResponse.success(res, 'Customer updated successfully', customer);
});

const remove = catchAsync(async (req, res) => {
  await customerService.deleteCustomer(req.params.id);
  return apiResponse.success(res, 'Customer deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
