'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BlacklistedToken extends Model {
    static associate(models) {
      BlacklistedToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  BlacklistedToken.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING(768),
        allowNull: false,
      },
      jti: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      blacklisted_at: {
        type: DataTypes.DATE,
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
    { sequelize, modelName: 'BlacklistedToken', tableName: 'blacklisted_tokens', timestamps: false }
  );

  return BlacklistedToken;
};
