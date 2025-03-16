require('dotenv').config()
const { Sequelize } = require('sequelize')
const { dbConfig } = require('../../config/config')

const env = process.env.NODE_ENV || 'development'
const config = dbConfig[env] || dbConfig.development
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: Number(config?.DB_POOL_MAX) || 10,
    min: Number(config?.DB_POOL_MIN) || 0,
    acquire: Number(config?.DB_POOL_ACQUIRE) || 30000,
    idle: Number(config?.DB_POOL_IDLE) || 10000,
  },
})

module.exports = sequelize
