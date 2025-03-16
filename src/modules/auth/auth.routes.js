const express = require('express')
const router = express.Router()
const authController = require('./auth.controller')
const authenticateMiddleware = require('../../middlewares/authenticate.middlware')

router.post('/register', authController.register)
router.post('/verify-email', authController.verifyEmail)
router.post('/login', authController.login)
router.post('/logout', authenticateMiddleware, authController.logout)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

module.exports = router
