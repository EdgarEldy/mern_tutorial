'use strict';
const { Category } = require('../models');

const findAll = () => Category.findAll();

const findById = (id) => Category.findByPk(id);

const create = (data) => Category.create(data);

const update = (id, data) => Category.update(data, { where: { id } });

const destroy = (id) => Category.destroy({ where: { id } });

module.exports = { findAll, findById, create, update, destroy };
