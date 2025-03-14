// src/modules/user/user.model.js
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')
const { roles } = require('../../../common/roleConfig')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: roles.user.id,
      references: {
        model: 'Role',
        key: 'id',
      },
    },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }],
    tableName: 'Users',
  }
)

User.associate = function (models) {
  User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' })
}

module.exports = User
