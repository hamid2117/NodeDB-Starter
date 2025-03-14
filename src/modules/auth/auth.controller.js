const authService = require('./auth.service')
const { successResponse } = require('../../utils')

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body)
    res
      .status(201)
      .json(
        successResponse(
          user,
          'Registration successful. Please verify your email.'
        )
      )
  } catch (err) {
    next(err)
  }
}

exports.verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.query.token)
    res.status(200).json(successResponse(null, 'Email verified successfully.'))
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body)
    res.status(200).json(successResponse(tokens, 'Login successful.'))
  } catch (err) {
    next(err)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email)
    res.status(200).json(successResponse(null, 'Password reset email sent.'))
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword)
    res.status(200).json(successResponse(null, 'Password has been reset.'))
  } catch (err) {
    next(err)
  }
}
