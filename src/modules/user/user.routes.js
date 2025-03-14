const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const authenticateMiddleware = require('../../middlewares/authenticate.middlware')

router.get('/me', authenticateMiddleware, userController.getProfile)
router.put('/me', authenticateMiddleware, userController.updateProfile)

module.exports = router
