'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Customer.init({
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        tel: DataTypes.STRING,
        email: DataTypes.STRING,
        address: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Customer',
    });
    return Customer;
};