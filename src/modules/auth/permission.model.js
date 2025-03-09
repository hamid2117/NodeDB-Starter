const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')
const Role = require('./role.model')

const Permission = sequelize.define(
  'Permission',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  {
    timestamps: false,
  }
)

Permission.belongsToMany(Role, {
  through: 'RolePermissions',
  foreignKey: 'permissionId',
  as: 'roles',
})

module.exports = Permission
