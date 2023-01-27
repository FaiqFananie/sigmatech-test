const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const OrderRepository = require('../../Domains/orders/OrderRepository')
const sequelize = require('../database/postgres')

class OrderRepositoryPostgres extends OrderRepository {
  constructor (model, menu) {
    super()
    this._order = model
    this._menu = menu
  }

  async addOrder (id, orderPayload) {
    const { tableNumber, isPaid, createdBy, menus } = orderPayload
    const t = await sequelize.transaction()

    try {
      const order = await this._order.create({
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
  }

  async getOrderById (id, createdBy) {
    const order = await this._order.findByPk(id, {
      include: {
        model: this._menu,
        attributes: ['id', 'name', 'price'],
        through: {
          attributes: []
        }
      }
    })

    if (!order) {
      throw new NotFoundError('Order tidak ditemukan')
    }

    if (order.createdBy !== createdBy) {
      throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
    }

    return order
  }

  async getOrders () {
    const order = await this._order.findAll({
      where: {
        isPaid: false
      }
    })

    return order
  }

  async countOrders () {
    const count = this._order.count()

    return count
  }
}

module.exports = OrderRepositoryPostgres
