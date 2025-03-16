'use strict'
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')
const { dbConfig } = require('../config/config')
const env = process.env.NODE_ENV || 'development'
const db = {}
const config = dbConfig[env] || dbConfig.development

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
)

// Recursive function to find all model files
function findModelFiles(dir, modelFiles = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && file !== 'node_modules' && file !== 'public') {
      findModelFiles(filePath, modelFiles)
    } else if (file.endsWith('.model.js')) {
      modelFiles.push(filePath)
    }
  }

  return modelFiles
}

// Find all .model files in the project
const projectRoot = path.resolve(__dirname, '../src/modules')
const modelFiles = findModelFiles(projectRoot)

// Load each model
modelFiles.forEach((file) => {
  const model = require(file)
  if (model.name) {
    db[model.name] = model
  }
})

// Set up associations

// Enhanced association setup with logging
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
