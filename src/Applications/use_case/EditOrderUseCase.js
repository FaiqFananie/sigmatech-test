const EditOrderPayload = require('../../Domains/orders/Entities/EditOrderPayload')

class EditOrderUseCase {
  constructor ({ orderRepository, menuRepository, orderMenuRepository }) {
    this._orderRepository = orderRepository
    this._menuRepository = menuRepository
  }

  async execute (id, useCasePayload) {
    const editOrderPayload = new EditOrderPayload(useCasePayload)

    if (editOrderPayload.menus.length > 0) {
      for (const menu of editOrderPayload.menus) {
        await this._menuRepository.verifyAvailableMenu(menu)
      }
    }

    return this._orderRepository.editOrder(id, editOrderPayload)
  }
}

module.exports = EditOrderUseCase
