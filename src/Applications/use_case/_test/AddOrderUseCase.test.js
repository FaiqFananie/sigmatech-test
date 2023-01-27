const MenuRepository = require('../../../Domains/menus/MenuRepository')
const OrderPayload = require('../../../Domains/orders/Entities/OrderPayload')
const OrderRepository = require('../../../Domains/orders/OrderRepository')
const AddOrderUseCase = require('../AddOrderUseCase')

describe('AddOrderUseCase', () => {
  it('should orchestrating the add order action correctly', async () => {
    // Arrange
    const useCasePayload = {
      tableNumber: 1,
      isPaid: false
    }

    const idOrder = 'order-123'

    const mockOrderRepository = new OrderRepository()
    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.verifyAvailableMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockOrderRepository.countOrders = jest.fn()
      .mockImplementation(() => Promise.resolve(1))
    mockOrderRepository.addOrder = jest.fn()
      .mockImplementation(() => Promise.resolve('order-123'))

    const addOrderUseCase = new AddOrderUseCase({
      menuRepository: mockMenuRepository,
      orderRepository: mockOrderRepository
    })

    // Action
    const newOrder = await addOrderUseCase.execute(useCasePayload)

    // Assert
    expect(newOrder).toStrictEqual(idOrder)
    expect(mockMenuRepository.verifyAvailableMenu).toBeCalledTimes(0)
    expect(mockOrderRepository.countOrders).toBeCalled()
    expect(mockOrderRepository.addOrder).toBeCalledWith('ABC27012023-002', new OrderPayload({
      tableNumber: useCasePayload.tableNumber,
      isPaid: useCasePayload.isPaid,
      menus: []
    }))
  })

  it('should orchestrating the add order action correctly', async () => {
    // Arrange
    const useCasePayload = {
      tableNumber: 1,
      isPaid: false
    }

    const idOrder = 'order-123'

    const mockOrderRepository = new OrderRepository()
    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.verifyAvailableMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockOrderRepository.countOrders = jest.fn()
      .mockImplementation(() => Promise.resolve(100))
    mockOrderRepository.addOrder = jest.fn()
      .mockImplementation(() => Promise.resolve('order-123'))

    const addOrderUseCase = new AddOrderUseCase({
      menuRepository: mockMenuRepository,
      orderRepository: mockOrderRepository
    })

    // Action
    const newOrder = await addOrderUseCase.execute(useCasePayload)

    // Assert
    expect(newOrder).toStrictEqual(idOrder)
    expect(mockMenuRepository.verifyAvailableMenu).toBeCalledTimes(0)
    expect(mockOrderRepository.countOrders).toBeCalled()
    expect(mockOrderRepository.addOrder).toBeCalledWith('ABC27012023-101', new OrderPayload({
      tableNumber: useCasePayload.tableNumber,
      isPaid: useCasePayload.isPaid,
      menus: []
    }))
  })

  it('should orchestrating the add order action correctly', async () => {
    // Arrange
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2023, 10, 27))

    const useCasePayload = {
      tableNumber: 1,
      isPaid: false
    }

    const idOrder = 'order-123'

    const mockOrderRepository = new OrderRepository()
    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.verifyAvailableMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockOrderRepository.countOrders = jest.fn()
      .mockImplementation(() => Promise.resolve(91))
    mockOrderRepository.addOrder = jest.fn()
      .mockImplementation(() => Promise.resolve('order-123'))

    const addOrderUseCase = new AddOrderUseCase({
      menuRepository: mockMenuRepository,
      orderRepository: mockOrderRepository
    })

    // Action
    const newOrder = await addOrderUseCase.execute(useCasePayload)

    // Assert
    expect(newOrder).toStrictEqual(idOrder)
    expect(mockMenuRepository.verifyAvailableMenu).toBeCalledTimes(0)
    expect(mockOrderRepository.countOrders).toBeCalled()
    expect(mockOrderRepository.addOrder).toBeCalledWith('ABC27112023-092', new OrderPayload({
      tableNumber: useCasePayload.tableNumber,
      isPaid: useCasePayload.isPaid,
      menus: []
    }))
  })
})
