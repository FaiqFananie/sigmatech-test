const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres',
    logging: false
  })

module.exports = sequelize
