'use strict';

const resources = ['categories', 'products', 'customers', 'orders', 'users'];
const actions = ['read', 'create', 'update', 'delete'];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const permissions = [];
    for (const resource of resources) {
      for (const action of actions) {
        permissions.push({ resource, action, createdAt: now, updatedAt: now });
      }
    }
    await queryInterface.bulkInsert('permissions', permissions);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
