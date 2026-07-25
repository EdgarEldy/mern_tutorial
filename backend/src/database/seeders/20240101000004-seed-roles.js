'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      { role_name: 'admin', createdAt: now, updatedAt: now },
      { role_name: 'user', createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
