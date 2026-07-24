'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer',
      });
      Order.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
      });
    }
  }

  Order.init(
    {
      customer_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
    }
  );

  return Order;
};
