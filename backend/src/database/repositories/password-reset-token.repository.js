'use strict';
const { PasswordResetToken } = require('../models');

const create = (data) => PasswordResetToken.create(data);
const findByToken = (token) => PasswordResetToken.findOne({ where: { token } });
const destroy = (id) => PasswordResetToken.destroy({ where: { id } });

module.exports = { create, findByToken, destroy };
