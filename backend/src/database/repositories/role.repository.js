'use strict';
const { Role } = require('../models');

const findByName = (role_name) => Role.findOne({ where: { role_name } });
const findById = (id) => Role.findByPk(id);

module.exports = { findByName, findById };
