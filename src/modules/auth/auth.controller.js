const authService = require('./auth.service')
const { successResponse, attachCookiesToResponse } = require('../../utils')
const {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('./auth.schema')
const { env } = require('../../../config/config')

exports.register = async (req, res, next) => {
  try {
    registerSchema.parse(req.body)
    await authService.register(req.body)
    res
      .status(201)
      .json(
        successResponse(
          null,
          'Success! Please check your email to verify account'
        )
      )
  } catch (err) {
    next(err)
  }
}

exports.verifyEmail = async (req, res, next) => {
  try {
    verifyEmailSchema.parse(req.body)
    await authService.verifyEmail(req.body)
    res.status(200).json(successResponse(null, 'Email verified successfully.'))
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    loginSchema.parse(req.body)
    const { user, permissionNames } = await authService.login(req.body)

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      permissions: permissionNames,
    }

    attachCookiesToResponse({ res, user: payload })

    res.status(200).json(
      successResponse(
        {
          email: user.email,
          name: user.name,
          isVarified: user.isVerified,
        },
        'Login successful.'
      )
    )
  } catch (err) {
    next(err)
  }
}
exports.logout = async (_req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(0),
    })

    res.status(200).json(successResponse(null, 'Logout successful.'))
  } catch (err) {
    next(err)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    forgotPasswordSchema.parse(req.body)
    await authService.forgotPassword(req.body.email)
    res
      .status(200)
      .json(
        successResponse(
          null,
          'Please check your email for reset password link.'
        )
      )
  } catch (err) {
    next(err)
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    resetPasswordSchema.parse(req.body)
    await authService.resetPassword(req.body)
    res.status(200).json(successResponse(null, 'Password has been reset.'))
  } catch (err) {
    next(err)
  }
}
