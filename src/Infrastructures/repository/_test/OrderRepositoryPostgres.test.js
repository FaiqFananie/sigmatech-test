const { Order, Menu } = require('../../../../models/menu_order')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const MenusTableTestHelper = require('../../../tests/MenusTableTestHelper')
const OrdersTableTestHelper = require('../../../tests/OrdersTableTestHelper')
const OrderRepositoryPostgres = require('../OrderRepositoryPostgres')

describe('OrderRepositoryPostgres', () => {
  afterEach(async () => {
    await MenusTableTestHelper.cleanTable()
    await OrdersTableTestHelper.cleanTable()
  })

  describe('addOrder function', () => {
    it('should persist menu and return id correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })
      const orderPayload = {
        tableNumber: 1,
        isPaid: false,
        createdBy: 'user-123',
        menus: [
          'menu-123',
          'menu-124'
        ]
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action
      await orderRepositoryPostgres.addOrder('order-123', orderPayload)

      // Assert
      const order = await OrdersTableTestHelper.findOrdersById('order-123')
      expect(order).toBeDefined()
    })

    it('should throw Error if something wrong', async () => {
      // Arrange
      const orderPayload = {
        isPaid: 'a',
        createdBy: 'user-123',
        menus: []
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, {})

      // Action & Assert
      await expect(orderRepositoryPostgres.addOrder('order-123', orderPayload)).rejects.toThrowError(Error)
    })
  })

  describe('countOrders function', () => {
    it('should return total number of order', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      await OrdersTableTestHelper.addOrder({ id: 'order-124' })
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, {})

      // Action
      const count = await orderRepositoryPostgres.countOrders()

      // Assert
      expect(count).toEqual(2)
    })
  })

  describe('getOrderById function', () => {
    it('should return order data correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })

      const orderPayload = {
        id: 'order-123',
        tableNumber: 1,
        createdBy: 'user-123',
        isPaid: false,
        menus: [
          'menu-123',
          'menu-124'
        ]
      }

      await OrdersTableTestHelper.addOrder(orderPayload)

      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, Menu)

      // Action
      const order = await orderRepositoryPostgres.getOrderById('order-123', 'user-123')

      // Assert
      expect(order.id).toEqual(orderPayload.id)
      expect(order.tableNumber).toEqual(orderPayload.tableNumber.toString())
      expect(order.createdBy).toEqual(orderPayload.createdBy)
      expect(order.isPaid).toEqual(orderPayload.isPaid)
      expect(order.menus[0]).toBeDefined()
      expect(order.menus[1]).toBeDefined()
    })

    it('should throw NotFoundError when order is not found', async () => {
      // Arrange

      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, Menu)

      // Action & Assert
      await expect(orderRepositoryPostgres.getOrderById('order-999', 'user-123')).rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when order is made not by user', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123', createdBy: 'user-123' })

      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, Menu)

      // Action & Assert
      await expect(orderRepositoryPostgres.getOrderById('order-123', 'user-124')).rejects.toThrowError(AuthorizationError)
    })
  })

  describe('getOrders function', () => {
    it('should return order data correctly', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, Menu)

      // Action
      const order = await orderRepositoryPostgres.getOrders()

      // Assert
      expect(typeof order).toEqual('object')
      expect(order.length).toEqual(1)
    })
  })

  it('should return empty array =', async () => {
    // Arrange
    const orderRepositoryPostgres = new OrderRepositoryPostgres(Order, Menu)

    // Action
    const order = await orderRepositoryPostgres.getOrders()

    // Assert
    expect(typeof order).toEqual('object')
    expect(order.length).toEqual(0)
  })
})
