'use strict'
const { roles } = require('../common/roleConfig')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Extract roles from config
    const roleRecords = Object.values(roles)

    // Insert roles
    await queryInterface.bulkInsert('Roles', roleRecords, {
      updateOnDuplicate: ['name', 'title', 'description', 'accessLevel'],
    })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
