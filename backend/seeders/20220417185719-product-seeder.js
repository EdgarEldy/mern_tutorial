'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        return queryInterface.bulkInsert("products", [
            {
                category_id: 1,
                product_name: "Amstel",
                unit_price: 2000,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                category_id: 1,
                product_name: "Primus",
                unit_price: 1600,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                category_id: 2,
                product_name: "Citron",
                unit_price: 800,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                category_id: 2,
                product_name: "Coca cola",
                unit_price: 800,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
