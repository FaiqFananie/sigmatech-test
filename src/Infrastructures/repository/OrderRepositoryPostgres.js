const OrderRepository = require('../../Domains/orders/OrderRepository')
const sequelize = require('../database/postgres')

class OrderRepositoryPostgres extends OrderRepository {
  constructor (model) {
    super()
    this._order = model
  }

  async addOrder (id, orderPayload) {
    const { tableNumber, isPaid, menus } = orderPayload
    const t = await sequelize.transaction()

    try {
      const order = await this._order.create({
        id,
        tableNumber,
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
  }

  async countOrders () {
    const count = this._order.count()

    return count
  }
}

module.exports = OrderRepositoryPostgres
