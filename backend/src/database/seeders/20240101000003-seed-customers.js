'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('customers', [
      {
        first_name: 'Alice',
        last_name: 'Johnson',
        telephone: '+1-555-0101',
        email: 'alice.johnson@example.com',
        address: '123 Main St, Springfield, IL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: 'Bob',
        last_name: 'Smith',
        telephone: '+1-555-0102',
        email: 'bob.smith@example.com',
        address: '456 Oak Ave, Portland, OR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        first_name: 'Carol',
        last_name: 'Williams',
        telephone: null,
        email: 'carol.williams@example.com',
        address: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('customers', null, {});
  },
};
