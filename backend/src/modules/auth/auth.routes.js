'use strict';
const { Router } = require('express');
const controller = require('./auth.controller');
const { register, login, forgotPassword, resetPassword } = require('./auth.validation');
const { protect } = require('../../middlewares/auth.middleware');

const router = Router();

router.post('/register', register, controller.register);
router.get('/activate/:token', controller.activate);
router.post('/login', login, controller.login);
router.post('/logout', protect, controller.logout);
router.post('/forgot-password', forgotPassword, controller.forgotPassword);
router.post('/reset-password', resetPassword, controller.resetPassword);

module.exports = router;
