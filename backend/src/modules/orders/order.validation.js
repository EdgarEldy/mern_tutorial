'use strict';
const { body } = require('express-validator');

const createOrder = [
  body('customer_id').notEmpty().isInt({ min: 1 }).withMessage('customer_id must be a positive integer'),
  body('product_id').notEmpty().isInt({ min: 1 }).withMessage('product_id must be a positive integer'),
  body('quantity').notEmpty().isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
];

const updateOrder = [
  body('customer_id').optional().isInt({ min: 1 }).withMessage('customer_id must be a positive integer'),
  body('product_id').optional().isInt({ min: 1 }).withMessage('product_id must be a positive integer'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
];

module.exports = { createOrder, updateOrder };
