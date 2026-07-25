'use strict';
const { User, Role, Permission } = require('../models');

const roleInclude = {
  model: Role,
  as: 'roles',
  through: { attributes: [] },
  include: [
    {
      model: Permission,
      as: 'permissions',
      through: { attributes: [] },
    },
  ],
};

const findAll = () => User.findAll({ include: [roleInclude] });
const findById = (id) => User.findByPk(id, { include: [roleInclude] });
const findByEmail = (email) => User.findOne({ where: { email }, include: [roleInclude] });
const create = (data) => User.create(data);
const update = (id, data) => User.update(data, { where: { id } });
const destroy = (id) => User.destroy({ where: { id } });
const addRole = (user, roleId) => user.addRole(roleId);

module.exports = { findAll, findById, findByEmail, create, update, destroy, addRole };
