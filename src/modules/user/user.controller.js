const userService = require('./user.service')
const { successResponse } = require('../../utils')

exports.getAllUsers = async (_req, res) => {
  const users = await userService.getAllUsers()
  res.status(200).json(successResponse(users))
}

exports.getSingleUser = async (req, res) => {
  const user = await userService.getUserById({ id: req.params.id })

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
  }
  res.status(200).json(successResponse(user))
}

exports.showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

exports.updateUser = async (req, res) => {
  const { id } = req.params
  const { name, email } = req.body
  if (
    id !== req.user.userId &&
    !req.user.permissions.includes('manage_users')
  ) {
    throw new CustomError.ForbiddenError(
      'You are not allowed to update this user'
    )
  }
  const user = await userService.updateUser({ id, name, email })

  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(200).json(successResponse(user))
}

exports.updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError('Please provide both values')
  }
  const user = await User.findOne({ _id: req.user.userId })

  const isPasswordCorrect = await user.comparePassword(oldPassword)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials')
  }
  user.password = newPassword

  await user.save()
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' })
}
