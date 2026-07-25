'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: 'role_permission',
        foreignKey: 'permission_id',
        as: 'roles',
      });
    }
  }

  Permission.init(
    {
      resource: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    { sequelize, modelName: 'Permission', tableName: 'permissions' }
  );

  return Permission;
};
