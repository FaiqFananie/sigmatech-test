class GetAllOrderUseCase {
  constructor ({ orderRepository }) {
    this._orderRepository = orderRepository
  }

  async execute () {
    return this._orderRepository.getOrders()
  }
}

module.exports = GetAllOrderUseCase
