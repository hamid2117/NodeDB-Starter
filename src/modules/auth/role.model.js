const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')
const Permission = require('./permission.model')

const Role = sequelize.define(
  'Role',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accessLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'any',
    },
  },

  { timestamps: false, tableName: 'Roles' }
)

Role.associate = function (models) {
  Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' })
  Role.belongsToMany(models.Permission, {
    through: 'RolePermissions',
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions',
  })
}

module.exports = Role
