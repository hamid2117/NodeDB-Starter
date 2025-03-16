const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const models = require('../../../models')
const CustomError = require('../../../errors')
const { env } = require('../../../config/config')
const User = models.User

exports.getUserById = async (id, options = {}) => {
  const queryOptions = {
    attributes: options.attributes || { exclude: ['passwordHash'] },
    ...options,
  }

  return await User.findByPk(id, queryOptions)
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

  if (rowsUpdated === 0)
    throw new CustomError.NotFoundError(`No user with id: ${id}`)

  const userObject = updatedUser.get({ plain: true })
  delete userObject.passwordHash

  return userObject
}

exports.getAllUsers = async (queryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    search = '',
  } = queryParams

  const offset = (page - 1) * limit

  const whereCondition = search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {}

  const { rows: users, count } = await User.findAndCountAll({
    where: whereCondition,
    order: [[sortBy, order.toUpperCase()]],
    limit,
    offset,
    attributes: { exclude: ['passwordHash'] },
  })

  return {
    users,
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  }
}

exports.updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId)

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`)
  }

  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.passwordHash)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid credentials')
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    parseInt(env.SALT_ROUNDS || 10)
  )

  user.passwordHash = passwordHash

  await user.save()

  return true
}
