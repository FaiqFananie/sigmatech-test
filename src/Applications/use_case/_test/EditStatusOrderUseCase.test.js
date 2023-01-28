const EditOrderStatusPayload = require('../../../Domains/orders/Entities/EditOrderStatusPayload')
const OrderRepository = require('../../../Domains/orders/OrderRepository')
const EditStatusOrderUseCase = require('../EditStatusOrderUseCase')

describe('EditOrderStatusUseCase', () => {
  it('should orchestrating the edit status order action correctly', async () => {
    // Arrange
    const useCasePayload = {
      isPaid: true
    }

    const idOrder = 'order-123'

    const mockOrderRepository = new OrderRepository()

    mockOrderRepository.editOrderStatus = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const editStatusOrderUseCase = new EditStatusOrderUseCase({
      orderRepository: mockOrderRepository
    })

    // Action
    await editStatusOrderUseCase.execute(idOrder, useCasePayload)

    // Assert
    expect(mockOrderRepository.editOrderStatus).toBeCalledWith(idOrder, new EditOrderStatusPayload({
      isPaid: useCasePayload.isPaid
    }))
  })
})
