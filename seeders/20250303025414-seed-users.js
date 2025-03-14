'use strict'
const { roles } = require('../common/roleConfig')
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@mail.com',
        passwordHash: await bcrypt.hash('password', 10),
        isVerified: true,
        roleId: roles.admin.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'User',
        email: 'user@mail.com',
        passwordHash: await bcrypt.hash('password', 10),
        isVerified: true,
        roleId: roles.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await queryInterface.bulkInsert('Users', users, {
      ignoreDuplicates: true,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      'Users',
      { email: ['admin@mail.com', 'user@mail.com'] },
      {}
    )
  },
}
