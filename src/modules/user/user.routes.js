const express = require('express')
const router = express.Router()
const userController = require('./user.controller')
const authenticateMiddleware = require('../../middlewares/authenticate.middlware')
const authorizeMiddleware = require('../../middlewares/authorize.middleware')

router.get(
  '/',
  authenticateMiddleware,
  authorizeMiddleware(['manage_users']),
  userController.getAllUsers
)

router.get('/:id', authenticateMiddleware, userController.getSingleUser)
router.get('/me', authenticateMiddleware, userController.showCurrentUser)

router.patch('/:id', authenticateMiddleware, userController.updateUser)

router.post(
  '/update-password',
  authenticateMiddleware,
  userController.updateUserPassword
)

module.exports = router
