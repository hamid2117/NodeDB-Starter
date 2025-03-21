const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')

const Permission = sequelize.define(
  'Permission',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: 'Permissions',
  }
)

Permission.associate = function (models) {
  Permission.belongsToMany(models.Role, {
    through: 'RolePermissions',
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles',
  })
}

module.exports = Permission
