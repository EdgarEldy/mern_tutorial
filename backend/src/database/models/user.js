'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: 'role_user',
        foreignKey: 'user_id',
        as: 'roles',
      });
      User.hasMany(models.BlacklistedToken, { foreignKey: 'user_id', as: 'blacklistedTokens' });
      User.hasMany(models.ActivationToken, { foreignKey: 'user_id', as: 'activationTokens' });
      User.hasMany(models.PasswordResetToken, { foreignKey: 'user_id', as: 'passwordResetTokens' });
    }
  }

  User.init(
    {
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      account_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    { sequelize, modelName: 'User', tableName: 'users' }
  );

  return User;
};
