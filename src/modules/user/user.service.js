const models = require('../../../models')
const User = models.User

exports.getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
  })
}

exports.updateUser = async (id, updateData) => {
  if (updateData.passwordHash) {
    delete updateData.passwordHash
  }

  const [rowsUpdated, [updatedUser]] = await User.update(updateData, {
    where: { id },
    returning: true,
    plain: true,
  })

  if (rowsUpdated === 0) throw new Error('User not found')

  const userObject = updatedUser.get({ plain: true })
  delete userObject.passwordHash

  return userObject
}
exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['passwordHash'] },
  })
}
