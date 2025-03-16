const jwt = require('jsonwebtoken')
const { env } = require('../../config/config')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME || '7d',
  })
  return token
}

const isTokenValid = (token) => jwt.verify(token, env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })
  const week = 1000 * 60 * 60 * 24 * 7
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + week),
    secure: env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}
