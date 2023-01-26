const { DataTypes } = require('sequelize')
const sequelize = require('../src/Infrastructures/database/postgres')

const Menu = sequelize.define('menus', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  ready: {
    allowNull: false,
    type: DataTypes.BOOLEAN
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER
  }
}, { paranoid: true })

module.exports = Menu
