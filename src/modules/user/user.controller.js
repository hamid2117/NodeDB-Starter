const userService = require('./user.service')
const { successResponse, attachCookiesToResponse } = require('../../utils')
const CustomError = require('../../../errors')
const {
  userIdSchema,
  updateUserSchema,
  updatePasswordSchema,
  getUsersQuerySchema,
} = require('./user.schema')

exports.getAllUsers = async (req, res, next) => {
  try {
    const queryParams = getUsersQuerySchema.parse(req.query)

    const users = await userService.getAllUsers(queryParams)
    res.status(200).json(successResponse(users))
  } catch (err) {
    next(err)
  }
}

exports.getSingleUser = async (req, res, next) => {
  try {
    const { id } = userIdSchema.parse({ id: req.params.id })

    const user = await userService.getUserById(id)
    if (!user) {
      throw new CustomError.NotFoundError(`No user with id: ${id}`)
    }

    res.status(200).json(successResponse(user))
  } catch (err) {
    next(err)
  }
}

exports.showCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json(successResponse(req.user))
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    // Validate ID parameter
    const { id } = userIdSchema.parse({ id: req.params.id })

    // Validate request body
    const updateData = updateUserSchema.parse(req.body)

    if (id !== req.user.id && !req.user.permissions.includes('manage_users')) {
      throw new CustomError.ForbiddenError(
        'You are not allowed to update this user'
      )
    }

    const user = await userService.updateUser(id, updateData)

    if (id === req.user.id) {
      const tokenUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: req.user.permissions,
      }
      attachCookiesToResponse({ res, user: tokenUser })
    }

    res.status(200).json(successResponse(user))
  } catch (err) {
    next(err)
  }
}

exports.updateUserPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body)

    const userId = req.user.id
    await userService.updatePassword(userId, oldPassword, newPassword)

    res.status(200).json(successResponse(null, 'Password updated successfully'))
  } catch (err) {
    next(err)
  }
}
