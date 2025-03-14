require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const { json, urlencoded } = express
const { logger } = require('./utils')
const errorHandler = require('./middlewares/error.middleware')

// Import routes
const authRoutes = require('./modules/auth/auth.routes')
const userRoutes = require('./modules/user/user.routes')

// Swagger UI setup
//const swaggerUi = require('swagger-ui-express')
//const openapiDocument = require('../docs/openapi.json')

const app = express()

// Middlewares
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload())

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

// 404 handler
app.use((_req, res, _next) => {
  res.status(404).json({ message: 'Not Found' })
})

// Global error handler
app.use(errorHandler)

// Start the server if not imported by tests
if (require.main === module) {
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
}

module.exports = app
