const { DataTypes } = require('sequelize')
const sequelize = require('../src/Infrastructures/database/postgres')

const User = sequelize.define('user', {
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = User
