const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const models = require('../../../models')
const User = models.User
const Role = models.Role
const Permission = models.Permission
const SALT_ROUNDS = 10

exports.register = async ({ name, email, password }) => {
  const existing = await User.findOne({ where: { email } })
  if (existing) throw new Error('Email already in use')

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  const user = await User.create({
    name,
    email,
    passwordHash,
    isVerified: true,
  })

  return user
}

exports.verifyEmail = async (token) => {
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid or expired token.')
  }
  const user = await User.findByPk(decoded.userId)
  if (!user) throw new Error('User not found.')
  user.isVerified = true
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

  if (!user) throw new Error('Invalid email or password.')
  if (!user.isVerified) throw new Error('Email not verified.')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error('Invalid email or password.')

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      permissions: permissionNames,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )

  return { accessToken }
}

exports.forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('No user found with that email.')

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetJWT = jwt.sign(
    { userId: user.id, token: resetToken },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )

  //await producer.send({
  //  topic: 'PASSWORD_RESET',
  //  messages: [
  //    {
  //      key: user.id.toString(),
  //      value: JSON.stringify({
  //        userId: user.id,
  //        email: user.email,
  //        resetToken: resetJWT,
  //      }),
  //    },
  //  ],
  //})
}

exports.resetPassword = async (token, newPassword) => {
  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    throw new Error('Invalid or expired token.')
  }
  const user = await User.findByPk(decoded.userId)
  if (!user) throw new Error('User not found.')
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  user.passwordHash = passwordHash
  await user.save()
}
