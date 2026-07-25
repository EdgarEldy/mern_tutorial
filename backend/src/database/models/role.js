'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: 'role_user',
        foreignKey: 'role_id',
        as: 'users',
      });
      Role.belongsToMany(models.Permission, {
        through: 'role_permission',
        foreignKey: 'role_id',
        as: 'permissions',
      });
    }
  }

  Role.init(
    {
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    { sequelize, modelName: 'Role', tableName: 'roles' }
  );

  return Role;
};
