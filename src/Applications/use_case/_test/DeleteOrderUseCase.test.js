const OrderRepository = require('../../../Domains/orders/OrderRepository')
const OrderMenuRepository = require('../../../Domains/order_menus/OrderMenuRepository')
const DeleteOrderUseCase = require('../DeleteOrderUseCase')

describe('DeleteOrderUseCase', () => {
  it('should orchestrating the delete order action correctly', async () => {
    // Arrange
    const id = 'order-123'

    const mockOrderRepository = new OrderRepository()
    const mockOrderMenuRepository = new OrderMenuRepository()

    mockOrderMenuRepository.removeRelation = jest.fn()
      .mockImplementation(() => Promise.resolve())

    mockOrderRepository.deleteOrder = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteOrderUseCase = new DeleteOrderUseCase({
      orderRepository: mockOrderRepository,
      orderMenuRepository: mockOrderMenuRepository
    })

    // Action
    await deleteOrderUseCase.execute(id)

    // Arrange
    expect(mockOrderMenuRepository.removeRelation).toBeCalledWith(id)
    expect(mockOrderRepository.deleteOrder).toBeCalledWith(id)
  })
})
