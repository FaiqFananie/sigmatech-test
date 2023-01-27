/* istanbul ignore file */
const { Order, Menu } = require('../../models/menu_order')
const sequelize = require('../Infrastructures/database/postgres')

const OrdersTableTestHelper = {
  async addOrder ({ id = 'order-123', tableNumber = 1, isPaid = false, createdBy = 'user-123', menus = [] }) {
    const t = await sequelize.transaction()

    try {
      const order = await Order.create({
        id,
        tableNumber,
        createdBy,
        isPaid
      })

      for (const menu of menus) {
        await order.addMenu(menu)
      }

      await t.commit()
      return order.id
    } catch (err) {
      await t.rollback()
      throw new Error(err.message)
    }
  },

  async findOrdersById (id) {
    const order = await Order.findByPk(id, {
      include: {
        model: Menu,
        attributes: ['id', 'name', 'price'],
        through: {
          attributes: []
        }
      }
    })

    return order
  },

  async cleanTable () {
    await Order.destroy({ truncate: true, force: true })
  }
}

module.exports = OrdersTableTestHelper
