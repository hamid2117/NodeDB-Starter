const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const CustomError = require('../../../errors')
const models = require('../../../models')
const {
  sendResetPasswordEmail,
  createHash,
  sendVerificationEmail,
} = require('../../utils')
const User = models.User
const Role = models.Role
const Permission = models.Permission
const SALT_ROUNDS = 10

exports.register = async ({ email, name, password }) => {
  const emailAlreadyExists = await User.findOne({ where: { email } })
  console.log('emailAlreadyExists', emailAlreadyExists, email)
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exiasts')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    passwordHash,
    verificationToken,
  })

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
  })
}

exports.verifyEmail = async ({ verificationToken, email }) => {
  const user = await User.findOne({ where: { email } })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  user.isVerified = true
  user.verifiedAt = Date.now()
  user.verificationToken = ''

  await user.save()
}

exports.login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: 'role',
        include: [
          {
            model: Permission,
            association: 'permissions',
          },
        ],
      },
    ],
  })

  // Extract permission names to a flat array
  const permissionNames = []
  user.role.permissions.forEach((permission) => {
    permissionNames.push(permission.name)
  })
  if (!user) {
    throw new CustomError.UnauthenticatedError('No user found with that email')
  }
  if (!user.isVerified)
    throw new CustomError.UnauthenticatedError('Email not verified.')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new CustomError.UnauthenticatedError('Incorrect password')

  return {
    user,
    permissionNames,
  }
}

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } })

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    // send email
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
    })

    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    user.passwordResetToken = createHash(passwordToken)
    user.passwordResetExpires = passwordTokenExpirationDate
    await user.save()
  }
}

exports.resetPassword = async ({ token, email, password }) => {
  const user = await User.findOne({ where: { email } })

  if (user) {
    const currentDate = new Date()
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    if (
      user.passwordResetToken === createHash(token) &&
      user.passwordResetExpires > currentDate
    ) {
      user.passwordHash = passwordHash
      user.passwordResetToken = null
      user.passwordResetExpires = null
      await user.save()
    }
  }
}
