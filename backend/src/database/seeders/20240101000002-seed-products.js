'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', [
      { category_id: 1, product_name: 'Laptop', unit_price: 999.99, createdAt: new Date(), updatedAt: new Date() },
      { category_id: 1, product_name: 'Wireless Mouse', unit_price: 29.99, createdAt: new Date(), updatedAt: new Date() },
      { category_id: 2, product_name: 'T-Shirt', unit_price: 19.99, createdAt: new Date(), updatedAt: new Date() },
      { category_id: 3, product_name: 'JavaScript: The Good Parts', unit_price: 24.99, createdAt: new Date(), updatedAt: new Date() },
      { category_id: 4, product_name: 'Coffee Maker', unit_price: 79.99, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
