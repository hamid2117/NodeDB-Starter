const { logger } = require('../utils')

module.exports = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    stack: err.stack,
  })
  const status = err.status || 500
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  }
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack
  }
  res.status(status).json(response)
}
