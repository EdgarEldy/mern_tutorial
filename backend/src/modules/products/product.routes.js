'use strict';
const { Router } = require('express');
const controller = require('./product.controller');
const { createProduct, updateProduct } = require('./product.validation');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', createProduct, controller.create);
router.put('/:id', updateProduct, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
