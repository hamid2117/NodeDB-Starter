'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      accessLevel: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'any',
      },
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Roles')
  },
}
