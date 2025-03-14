'use strict'
const { roles, permissions, rolePermissions } = require('../common/roleConfig')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Create permission records from config
    const permissionRecords = Object.values(permissions)

    // Insert permissions
    await queryInterface.bulkInsert('Permissions', permissionRecords, {
      updateOnDuplicate: ['name', 'description'],
    })

    // Create role-permission associations
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

    // Insert role-permission associations
    await queryInterface.bulkInsert('RolePermissions', rolePermissionRecords, {
      updateOnDuplicate: ['roleId', 'permissionId'],
    })
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('RolePermissions', null, {})
    await queryInterface.bulkDelete('Permissions', null, {})
  },
}
