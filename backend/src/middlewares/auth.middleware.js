'use strict';
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const blacklistedTokenRepository = require('../database/repositories/blacklisted-token.repository');
const userRepository = require('../database/repositories/user.repository');
const apiResponse = require('../shared/utils/apiResponse');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiResponse.error(res, 'No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return apiResponse.error(res, 'Invalid or expired token', 401);
  }

  const blacklisted = await blacklistedTokenRepository.findByJti(decoded.jti);
  if (blacklisted) {
    return apiResponse.error(res, 'Token has been revoked', 401);
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    return apiResponse.error(res, 'User not found', 401);
  }
  if (!user.enabled) {
    return apiResponse.error(res, 'Account is not activated', 403);
  }
  if (user.account_locked) {
    return apiResponse.error(res, 'Account is locked', 403);
  }

  req.user = user;
  req.token = token;
  req.tokenDecoded = decoded;
  next();
};

module.exports = { protect };
