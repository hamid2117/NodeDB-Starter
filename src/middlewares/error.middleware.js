const { logger } = require('../utils')
const { z } = require('zod')
const { env } = require('../../config/config')
module.exports = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    stack: err.stack,
  })
  if (err instanceof z.ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))

    return res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors,
    })
  }

  const status = err.status || 500
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  }
  if (env.NODE_ENV !== 'production') {
    response.stack = err.stack
  }
  res.status(status).json(response)
}
