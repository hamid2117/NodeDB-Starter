const CustomError = require('../../errors')
const { isTokenValid } = require('../utils')

module.exports = async function verifyToken(req, _res, next) {
  const token = req.signedCookies.token

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
  try {
    const { id, email, permissions } = isTokenValid({ token })
    req.user = { id, email, permissions }
    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid')
  }
}
