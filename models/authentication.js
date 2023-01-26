const { DataTypes } = require('sequelize')
const sequelize = require('../src/Infrastructures/database/postgres')

const Authentication = sequelize.define('authentications', {
  token: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Authentication
