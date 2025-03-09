// src/modules/user/user.model.js
const { DataTypes } = require('sequelize')
const sequelize = require('../../config/db.config')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    indexes: [{ unique: true, fields: ['email'] }],
  }
)
User.belongsToMany(Role, {
  through: 'UserRoles',
  foreignKey: 'userId',
  as: 'roles',
})

module.exports = User
