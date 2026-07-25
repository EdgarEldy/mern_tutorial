'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ActivationToken extends Model {
    static associate(models) {
      ActivationToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  ActivationToken.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      validated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize, modelName: 'ActivationToken', tableName: 'activation_tokens', timestamps: false }
  );

  return ActivationToken;
};
