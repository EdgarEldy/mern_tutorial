'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ACTIVATION_TOKEN_TTL_HOURS,
  RESET_TOKEN_TTL_HOURS,
} = require('../../config/env');
const userRepository = require('../../database/repositories/user.repository');
const roleRepository = require('../../database/repositories/role.repository');
const blacklistedTokenRepository = require('../../database/repositories/blacklisted-token.repository');
const activationTokenRepository = require('../../database/repositories/activation-token.repository');
const passwordResetTokenRepository = require('../../database/repositories/password-reset-token.repository');

const generateHexToken = () => crypto.randomBytes(32).toString('hex');

const register = async ({ first_name, last_name, email, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await userRepository.create({
    first_name,
    last_name,
    email,
    password: hashed,
    enabled: false,
    account_locked: false,
  });

  const defaultRole = await roleRepository.findByName('user');
  if (defaultRole) {
    await userRepository.addRole(user, defaultRole.id);
  }

  const token = generateHexToken();
  const ttlHours = ACTIVATION_TOKEN_TTL_HOURS || 24;
  const expires_at = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  await activationTokenRepository.create({
    user_id: user.id,
    token,
    created_at: new Date(),
    expires_at,
  });

  return { activationToken: token };
};

const activate = async (token) => {
  const record = await activationTokenRepository.findByToken(token);
  if (!record) {
    const err = new Error('Invalid activation token');
    err.statusCode = 400;
    throw err;
  }
  if (record.validated_at) {
    const err = new Error('Account already activated');
    err.statusCode = 400;
    throw err;
  }
  if (record.expires_at && new Date() > record.expires_at) {
    const err = new Error('Activation token has expired');
    err.statusCode = 400;
    throw err;
  }

  await userRepository.update(record.user_id, { enabled: true });
  await activationTokenRepository.update(record.id, { validated_at: new Date() });
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }
  if (!user.enabled) {
    const err = new Error('Account is not activated');
    err.statusCode = 403;
    throw err;
  }
  if (user.account_locked) {
    const err = new Error('Account is locked');
    err.statusCode = 403;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const jti = crypto.randomUUID();
  const payload = { id: user.id, email: user.email, jti };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  const { password: _pw, ...safeUser } = user.toJSON();
  return { token, user: safeUser };
};

const logout = async ({ token, tokenDecoded }) => {
  const expiresAt = tokenDecoded.exp ? new Date(tokenDecoded.exp * 1000) : null;

  await blacklistedTokenRepository.create({
    user_id: tokenDecoded.id,
    token,
    jti: tokenDecoded.jti,
    blacklisted_at: new Date(),
    created_at: new Date(),
    expires_at: expiresAt,
  });
};

const forgotPassword = async ({ email }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) return null;

  const token = generateHexToken();
  const ttlHours = RESET_TOKEN_TTL_HOURS || 1;
  const expiry_date = new Date(Date.now() + ttlHours * 60 * 60 * 1000);

  await passwordResetTokenRepository.create({
    user_id: user.id,
    token,
    type: 'password_reset',
    expiry_date,
  });

  return { resetToken: token };
};

const resetPassword = async ({ token, password }) => {
  const record = await passwordResetTokenRepository.findByToken(token);
  if (!record) {
    const err = new Error('Invalid reset token');
    err.statusCode = 400;
    throw err;
  }
  if (new Date() > record.expiry_date) {
    const err = new Error('Reset token has expired');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 12);
  await userRepository.update(record.user_id, { password: hashed });
  await passwordResetTokenRepository.destroy(record.id);
};

module.exports = { register, activate, login, logout, forgotPassword, resetPassword };
