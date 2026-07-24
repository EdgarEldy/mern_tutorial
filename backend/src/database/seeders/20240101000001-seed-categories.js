'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', [
      { category_name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
      { category_name: 'Clothing', createdAt: new Date(), updatedAt: new Date() },
      { category_name: 'Books', createdAt: new Date(), updatedAt: new Date() },
      { category_name: 'Home & Kitchen', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
