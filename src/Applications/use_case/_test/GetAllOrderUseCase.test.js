const OrderRepository = require('../../../Domains/orders/OrderRepository')
const GetAllOrderUseCase = require('../GetAllOrderUseCase')

describe('GetAllOrderUseCase', () => {
  it('should orchestrating the get all menu action correctly', async () => {
    // Arrange
    const id = 'order-123'
    const expectedResult = [{
      id,
      rableNumber: 1,
      isPaid: false,
      menus: []
    }]

    const mockOrderRepository = new OrderRepository()
    mockOrderRepository.getOrders = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id,
        rableNumber: 1,
        isPaid: false,
        menus: []
      }]))

    const getOrderUseCase = new GetAllOrderUseCase({
      orderRepository: mockOrderRepository
    })

    // Action
    const result = await getOrderUseCase.execute()

    // Arrange
    expect(result).toEqual(expectedResult)
    expect(mockOrderRepository.getOrders).toBeCalled()
  })
})
