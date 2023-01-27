const OrderRepository = require('../OrderRepository')

describe('OrderRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const orderRepository = new OrderRepository()

    // Assert
    await expect(orderRepository.addOrder('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(orderRepository.editOrder('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(orderRepository.getOrderById('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(orderRepository.getOrders('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(orderRepository.deleteOrder('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(orderRepository.countOrders('')).rejects.toThrowError('ORDER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
