'use strict'

const { UUIDV4 } = require('sequelize')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // Enable UUID extension if not already enabled
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    )

    // Define roles and their permissions in a declarative way
    const rolesWithAuthorities = {
      superAdmin: [
        'manage_users',
        'manage_roles',
        'manage_settings',
        'manage_content',
      ],
      admin: ['manage_users'],
      manager: ['view_users'],
      user: ['view_content'],
    }

    // First collect all unique permissions
    const uniquePermissions = new Set()
    Object.values(rolesWithAuthorities).forEach((permissions) => {
      permissions.forEach((permission) => uniquePermissions.add(permission))
    })

    // Create permission records with UUIDs
    const permissionRecords = Array.from(uniquePermissions).map((name) => ({
      id: UUIDV4(),
      name,
      createdAt: new Date(),
    }))

    // Create role records with UUIDs
    const roleRecords = Object.keys(rolesWithAuthorities).map((name) => ({
      id: UUIDV4(),
      name,
    }))

    // Create permission map for easy lookup
    const permissionMap = {}
    permissionRecords.forEach((p) => {
      permissionMap[p.name] = p.id
    })

    // Create role map for easy lookup
    const roleMap = {}
    roleRecords.forEach((r) => {
      roleMap[r.name] = r.id
    })

    // Create role-permission associations
    const rolePermissions = []
    Object.entries(rolesWithAuthorities).forEach(([roleName, permissions]) => {
      permissions.forEach((permissionName) => {
        rolePermissions.push({
          roleId: roleMap[roleName],
          permissionId: permissionMap[permissionName],
        })
      })
    })

    // Insert all data
    await queryInterface.bulkInsert('Roles', roleRecords, {
      updateOnDuplicate: ['name'],
    })

    await queryInterface.bulkInsert('Permissions', permissionRecords, {
      updateOnDuplicate: ['name'],
    })

    await queryInterface.bulkInsert('RolePermissions', rolePermissions, {
      updateOnDuplicate: ['roleId', 'permissionId'],
    })

    // Create a default admin user
    const adminUser = {
      id: UUIDV4(),
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash:
        '$2b$10$TuquBTFMZyDXS4NJeMz8aeJO0KPM9ZTb5faRqGVR0ZIAjXgXBL7nq', // "password"
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await queryInterface.bulkInsert('Users', [adminUser], {
      updateOnDuplicate: ['email'],
    })

    await queryInterface.bulkInsert(
      'UserRoles',
      [{ userId: adminUser.id, roleId: roleMap['superAdmin'] }],
      {
        updateOnDuplicate: ['userId', 'roleId'],
      }
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('UserRoles', null, {})
    await queryInterface.bulkDelete('RolePermissions', null, {})
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {})
    await queryInterface.bulkDelete('Permissions', null, {})
    await queryInterface.bulkDelete('Roles', null, {})
  },
}
