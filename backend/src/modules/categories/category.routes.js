'use strict';
const { Router } = require('express');
const controller = require('./category.controller');
const { createCategory, updateCategory } = require('./category.validation');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', createCategory, controller.create);
router.put('/:id', updateCategory, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
