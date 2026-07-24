'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products',
      });
    }
  }

  Category.init(
    {
      category_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
    }
  );

  return Category;
};
