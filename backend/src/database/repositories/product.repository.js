'use strict';
const { Product, Category } = require('../models');

const findAll = () =>
  Product.findAll({ include: [{ model: Category, as: 'category' }] });

const findById = (id) =>
  Product.findByPk(id, { include: [{ model: Category, as: 'category' }] });

const create = (data) => Product.create(data);

const update = (id, data) => Product.update(data, { where: { id } });

const destroy = (id) => Product.destroy({ where: { id } });

module.exports = { findAll, findById, create, update, destroy };
