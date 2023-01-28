const OrderRepository = require('../../../Domains/orders/OrderRepository')
const MenuRepository = require('../../../Domains/menus/MenuRepository')
const EditOrderUseCase = require('../EditOrderUseCase')
const EditOrderPayload = require('../../../Domains/orders/Entities/EditOrderPayload')

describe('EditOrderUseCase', () => {
  it('should orchestrating the edit menu action correctly', async () => {
    // Arrange
    const useCasePayload = {
      tableNumber: 1,
      menus: ['menu-123']
    }

    const idOrder = 'order-123'

    const mockOrderRepository = new OrderRepository()
    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.verifyAvailableMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockOrderRepository.editOrder = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const editOrderUseCase = new EditOrderUseCase({
      orderRepository: mockOrderRepository,
      menuRepository: mockMenuRepository
    })

    // Action
    await editOrderUseCase.execute(idOrder, useCasePayload)

    // Assert
    expect(mockMenuRepository.verifyAvailableMenu).toBeCalledTimes(1)
    expect(mockOrderRepository.editOrder).toBeCalledWith(idOrder, new EditOrderPayload({
      tableNumber: useCasePayload.tableNumber,
      menus: useCasePayload.menus
    }))
  })
})
