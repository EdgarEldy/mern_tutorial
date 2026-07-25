'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Product.hasMany(models.Order, {
        foreignKey: 'product_id',
        as: 'orders',
      });
    }
  }

  Product.init(
    {
      category_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
    }
  );

  return Product;
};
