const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET)
  return token
}

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })
  const week = 1000 * 60 * 60 * 24 * 7
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + week),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
}
