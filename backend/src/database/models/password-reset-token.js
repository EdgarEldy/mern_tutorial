'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PasswordResetToken extends Model {
    static associate(models) {
      PasswordResetToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  PasswordResetToken.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'PasswordResetToken', tableName: 'password_reset_tokens', timestamps: false }
  );

  return PasswordResetToken;
};
