class DeleteOrderUseCase {
  constructor ({ orderRepository, orderMenuRepository }) {
    this._orderRepository = orderRepository
    this._orderMenuRepository = orderMenuRepository
  }

  async execute (id) {
    await this._orderRepository.deleteOrder(id)
    return this._orderMenuRepository.removeRelation(id)
  }
}

module.exports = DeleteOrderUseCase
