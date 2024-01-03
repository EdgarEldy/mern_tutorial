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
        return queryInterface.bulkInsert("Customers", [
            {
                first_name: "John",
                last_name: "Doe",
                tel: "76 444 346",
                email: "johndoe@gmail.com",
                address: "Capetown",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                first_name: "Mary",
                last_name: "Jane",
                tel: "76 534 487",
                email: "maryjane@gmail.com",
                address: "Kentucky",
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
        await queryInterface.bulkDelete('Customers', null, {});
    }
};
