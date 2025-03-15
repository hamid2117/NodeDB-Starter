const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const sendVerificationEmail = require('./sendVerficationEmail')
const sendResetPasswordEmail = require('./sendResetPasswordEmail')
const createHash = require('./createHash')
const { errorResponse, successResponse } = require('./responseHandler')
const logger = require('./logger')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  errorResponse,
  successResponse,
  logger,
}
