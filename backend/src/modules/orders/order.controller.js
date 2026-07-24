'use strict';
const { validationResult } = require('express-validator');
const orderService = require('./order.service');
const apiResponse = require('../../shared/utils/apiResponse');
const catchAsync = require('../../shared/utils/catchAsync');

const getAll = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  return apiResponse.success(res, 'Orders retrieved successfully', orders);
});

const getOne = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  return apiResponse.success(res, 'Order retrieved successfully', order);
});

const create = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const order = await orderService.createOrder(req.body);
  return apiResponse.success(res, 'Order created successfully', order, 201);
});

const update = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const order = await orderService.updateOrder(req.params.id, req.body);
  return apiResponse.success(res, 'Order updated successfully', order);
});

const remove = catchAsync(async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  return apiResponse.success(res, 'Order deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
