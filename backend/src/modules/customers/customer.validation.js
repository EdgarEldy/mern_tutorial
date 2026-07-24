'use strict';
const { body } = require('express-validator');

const createCustomer = [
  body('first_name').optional().isString().isLength({ max: 255 }),
  body('last_name').optional().isString().isLength({ max: 255 }),
  body('telephone').optional().isString().isLength({ max: 50 }),
  body('email').optional().isEmail().isLength({ max: 255 }),
  body('address').optional().isString().isLength({ max: 255 }),
];

const updateCustomer = [
  body('first_name').optional().isString().isLength({ max: 255 }),
  body('last_name').optional().isString().isLength({ max: 255 }),
  body('telephone').optional().isString().isLength({ max: 50 }),
  body('email').optional().isEmail().isLength({ max: 255 }),
  body('address').optional().isString().isLength({ max: 255 }),
];

module.exports = { createCustomer, updateCustomer };
