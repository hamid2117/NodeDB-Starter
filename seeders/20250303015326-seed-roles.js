'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          id: 1,
          name: 'admin',
          title: 'Administrator',
          description: 'Full access to all system features',
          accessLevel: 'all',
        },
        {
          id: 2,
          name: 'user',
          title: 'Standard User',
          description: 'Regular user with limited access',
          accessLevel: 'organization',
        },
      ],
      {
        ignoreDuplicates: true,
      }
    )
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
