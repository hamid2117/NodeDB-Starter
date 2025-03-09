const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')
const User = require('../user/user.model')
const Permission = require('./permission.model')

const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { timestamps: false }
)

Role.belongsToMany(User, {
  through: 'UserRoles',
  foreignKey: 'roleId',
  as: 'users',
})

// Many-to-Many: Roles <-> Permissions
Role.belongsToMany(Permission, {
  through: 'RolePermissions',
  foreignKey: 'roleId',
  as: 'permissions',
})

module.exports = Role
