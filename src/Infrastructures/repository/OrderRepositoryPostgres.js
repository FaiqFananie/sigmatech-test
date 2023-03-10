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

      await order.setMenus(menus)

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

  async editOrder (id, editOrderPayload) {
    const { tableNumber, menus } = editOrderPayload
    const t = await sequelize.transaction()

    const updatedOrder = await this._order.update({
      tableNumber
    }, { where: { id } })

    if (updatedOrder[0] === 0) {
      await t.rollback()
      throw new NotFoundError('Order gagal diperbarui, Id tidak ditemukan')
    }

    if (menus.length > 0) {
      const order = await this._order.findByPk(id)
      await order.setMenus(menus)
    }

    await t.commit()
  }

  async editOrderStatus (id, editOrderStatusPayload) {
    const { isPaid } = editOrderStatusPayload

    const updatedOrder = await this._order.update({
      isPaid
    }, { where: { id } })

    if (updatedOrder[0] === 0) {
      throw new NotFoundError('Order gagal diperbarui, Id tidak ditemukan')
    }
  }

  async deleteOrder (id) {
    const deletedOrder = await this._order.destroy({ where: { id } })

    if (deletedOrder === 0) {
      throw new NotFoundError('Order gagal dihapus, Id tidak ditemukan')
    }
  }

  async countOrders () {
    const count = this._order.count()

    return count
  }
}

module.exports = OrderRepositoryPostgres
