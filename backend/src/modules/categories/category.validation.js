'use strict';
const { body } = require('express-validator');

const createCategory = [
  body('category_name')
    .trim()
    .notEmpty().withMessage('category_name is required')
    .isLength({ max: 255 }).withMessage('category_name must not exceed 255 characters'),
];

const updateCategory = [
  body('category_name')
    .optional()
    .trim()
    .notEmpty().withMessage('category_name cannot be empty')
    .isLength({ max: 255 }).withMessage('category_name must not exceed 255 characters'),
];

module.exports = { createCategory, updateCategory };
