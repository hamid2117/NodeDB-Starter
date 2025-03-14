'use strict'
const { roles, permissions, rolePermissions } = require('../common/roleConfig')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const permissionRecords = Object.values(permissions)

    await queryInterface.bulkInsert('Permissions', permissionRecords, {
      ignoreDuplicates: true,
    })

    const rolePermissionRecords = []
    Object.entries(rolePermissions).forEach(([roleName, permissionNames]) => {
      const roleId = roles[roleName].id
      permissionNames.forEach((permissionName) => {
        rolePermissionRecords.push({
          roleId: roleId,
          permissionId: permissions[permissionName].id,
        })
      })
    })

    await queryInterface.bulkInsert('RolePermissions', rolePermissionRecords, {
      ignoreDuplicates: true,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('RolePermissions', null, {})
    await queryInterface.bulkDelete('Permissions', null, {})
  },
}
