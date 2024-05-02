'use strict';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      // наименование полей в snake_case,
      // потому что не нашел другого решения для миграций
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      jti: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      exp: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_agent: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  },
};
