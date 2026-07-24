'use strict';
const { Customer } = require('../models');

const findAll = () => Customer.findAll();
const findById = (id) => Customer.findByPk(id);
const create = (data) => Customer.create(data);
const update = (id, data) => Customer.update(data, { where: { id } });
const destroy = (id) => Customer.destroy({ where: { id } });

module.exports = { findAll, findById, create, update, destroy };
