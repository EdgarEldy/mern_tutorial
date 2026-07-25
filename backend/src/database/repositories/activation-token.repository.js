'use strict';
const { ActivationToken } = require('../models');

const create = (data) => ActivationToken.create(data);
const findByToken = (token) => ActivationToken.findOne({ where: { token } });
const update = (id, data) => ActivationToken.update(data, { where: { id } });

module.exports = { create, findByToken, update };
