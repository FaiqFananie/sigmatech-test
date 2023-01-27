class GetOrderUseCase {
  constructor ({ orderRepository }) {
    this._orderRepository = orderRepository
  }

  async execute (id, createdBy) {
    return await this._orderRepository.getOrderById(id, createdBy)
  }
}

module.exports = GetOrderUseCase
