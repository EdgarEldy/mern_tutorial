'use strict';
const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const apiResponse = require('../../shared/utils/apiResponse');
const catchAsync = require('../../shared/utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const { first_name, last_name, email, password } = req.body;
  const result = await authService.register({ first_name, last_name, email, password });
  return apiResponse.success(
    res,
    'Registration successful. Check your email to activate your account.',
    { activationToken: result.activationToken },
    201
  );
});

const activate = catchAsync(async (req, res) => {
  await authService.activate(req.params.token);
  return apiResponse.success(res, 'Account activated successfully');
});

const login = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return apiResponse.success(res, 'Login successful', result);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout({ token: req.token, tokenDecoded: req.tokenDecoded });
  return apiResponse.success(res, 'Logged out successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const result = await authService.forgotPassword({ email: req.body.email });
  return apiResponse.success(
    res,
    'If this email exists, a reset link has been sent',
    result || null
  );
});

const resetPassword = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return apiResponse.error(res, 'Validation failed', 422, errors.array());
  }
  const { token, password } = req.body;
  await authService.resetPassword({ token, password });
  return apiResponse.success(res, 'Password reset successfully');
});

module.exports = { register, activate, login, logout, forgotPassword, resetPassword };
