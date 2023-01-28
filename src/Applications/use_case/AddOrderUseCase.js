const OrderPayload = require('../../Domains/orders/Entities/OrderPayload')

class AddOrderUseCase {
  constructor ({ orderRepository, menuRepository }) {
    this._orderRepository = orderRepository
    this._menuRepository = menuRepository
  }

  async execute (useCasePayload) {
    const orderPayload = new OrderPayload(useCasePayload)

    let total = await this._orderRepository.countOrders() + 1
    if (total < 10) {
      total = `00${total}`
    } else if (total < 100) {
      total = `0${total}`
    }

    const now = new Date()
    let month = now.getMonth() + 1
    if (month < 10) {
      month = `0${month}`
    }

    const id = `ABC${now.getDate()}${month}${now.getFullYear()}-${total}`

    for (const menu of orderPayload.menus) {
      await this._menuRepository.verifyAvailableMenu(menu)
    }
    return this._orderRepository.addOrder(id, orderPayload)
  }
}

module.exports = AddOrderUseCase
