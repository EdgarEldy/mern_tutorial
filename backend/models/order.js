'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Add relationship to Customer model
            Order.belongsTo(models.Customer, {
                foreignKey: 'customer_id',
                onDelete: 'CASCADE'
            });
            // Add relationship to Product model
            Order.belongsTo(models.Product, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE'
            });
        }
    };
    Order.init({
        customer_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        qty: DataTypes.FLOAT,
        total: DataTypes.FLOAT
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};