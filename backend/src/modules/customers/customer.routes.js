'use strict';
const { Router } = require('express');
const controller = require('./customer.controller');
const { createCustomer, updateCustomer } = require('./customer.validation');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', createCustomer, controller.create);
router.put('/:id', updateCustomer, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
