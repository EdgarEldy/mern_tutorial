'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blacklisted_tokens', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      token: {
        type: Sequelize.STRING(768),
        allowNull: false,
      },
      jti: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      blacklisted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      validated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blacklisted_tokens');
  },
};
