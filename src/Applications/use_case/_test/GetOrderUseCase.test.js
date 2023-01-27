const OrderRepository = require('../../../Domains/orders/OrderRepository')
const GetOrderUseCase = require('../GetOrderUseCase')

describe('GetOrderUseCase', () => {
  it('should orchestrating the get order action correctly', async () => {
    // Arrange
    const id = 'order-123'
    const expectedResult = {
      id,
      rableNumber: 1,
      isPaid: false,
      menus: []
    }

    const mockOrderRepository = new OrderRepository()
    mockOrderRepository.getOrderById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id,
        rableNumber: 1,
        isPaid: false,
        menus: []
      }))

    const getOrderUseCase = new GetOrderUseCase({
      orderRepository: mockOrderRepository
    })

    // Action
    const result = await getOrderUseCase.execute(id)

    // Arrange
    expect(result).toEqual(expectedResult)
    expect(mockOrderRepository.getOrderById).toBeCalledWith(id)
  })
})
