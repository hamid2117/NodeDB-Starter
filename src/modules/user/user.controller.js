const userService = require('./user.service')
const { successResponse } = require('../../utils')

exports.getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id)
    res.status(200).json(successResponse(user))
  } catch (err) {
    next(err)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.user.id, req.body)
    res.status(200).json(successResponse(updatedUser))
  } catch (err) {
    next(err)
  }
}
