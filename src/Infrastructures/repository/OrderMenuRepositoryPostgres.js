const OrderMenuRepository = require('../../Domains/order_menus/OrderMenuRepository')

class OrderMenuRepositoryPostgres extends OrderMenuRepository {
  constructor (model) {
    super()
    this._orderMenu = model
  }

  async removeRelation (id) {
    await this._orderMenu.destroy({ where: { orderId: id } })
  }
}

module.exports = OrderMenuRepositoryPostgres
