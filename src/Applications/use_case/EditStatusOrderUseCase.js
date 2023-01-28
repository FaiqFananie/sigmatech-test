const EditOrderStatusPayload = require('../../Domains/orders/Entities/EditOrderStatusPayload')

class EditStatusOrderUseCase {
  constructor ({ orderRepository }) {
    this._orderRepository = orderRepository
  }

  async execute (id, useCasePayload) {
    const editOrderStatusPayload = new EditOrderStatusPayload(useCasePayload)
    return this._orderRepository.editOrderStatus(id, editOrderStatusPayload)
  }
}

module.exports = EditStatusOrderUseCase
