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

const Order = sequelize.define('orders', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  tableNumber: {
    type: DataTypes.INTEGER
  },
  isPaid: {
    type: DataTypes.BOOLEAN
  }
}, { paranoid: true })

const OrderMenu = sequelize.define('order_menus', {}, { timestamps: false })

Menu.belongsToMany(Order, {
  through: OrderMenu,
  foreignKey: 'menuId'
})
Order.belongsToMany(Menu, {
  through: OrderMenu,
  foreignKey: 'orderId'
})

module.exports = { Menu, Order, OrderMenu }
