'use strict';
const { Router } = require('express');
const controller = require('./order.controller');
const { createOrder, updateOrder } = require('./order.validation');

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.post('/', createOrder, controller.create);
router.put('/:id', updateOrder, controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
