class GetOrderUseCase {
  constructor ({ orderRepository }) {
    this._orderRepository = orderRepository
  }

  async execute (id) {
    return await this._orderRepository.getOrderById(id)
  }
}

module.exports = GetOrderUseCase
