'use strict';
const { body } = require('express-validator');

const createProduct = [
  body('product_name')
    .trim()
    .notEmpty().withMessage('product_name is required')
    .isLength({ max: 255 }).withMessage('product_name must not exceed 255 characters'),
  body('unit_price')
    .notEmpty().withMessage('unit_price is required')
    .isFloat({ min: 0 }).withMessage('unit_price must be a positive number'),
  body('category_id')
    .notEmpty().withMessage('category_id is required')
    .isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
];

const updateProduct = [
  body('product_name')
    .optional()
    .trim()
    .notEmpty().withMessage('product_name cannot be empty')
    .isLength({ max: 255 }).withMessage('product_name must not exceed 255 characters'),
  body('unit_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('unit_price must be a positive number'),
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('category_id must be a positive integer'),
];

module.exports = { createProduct, updateProduct };
