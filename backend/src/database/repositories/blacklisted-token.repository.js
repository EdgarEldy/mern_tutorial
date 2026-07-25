'use strict';
const { BlacklistedToken } = require('../models');

const create = (data) => BlacklistedToken.create(data);
const findByJti = (jti) => BlacklistedToken.findOne({ where: { jti } });

module.exports = { create, findByJti };
