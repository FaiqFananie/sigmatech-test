const { Order, Menu } = require('../../../../models/menu_order')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const MenusTableTestHelper = require('../../../tests/MenusTableTestHelper')
const OrderMenusTableTestHelper = require('../../../tests/OrderMenusTableTestHelper')
const OrdersTableTestHelper = require('../../../tests/OrdersTableTestHelper')
const OrderRepositoryPostgres = require('../OrderRepositoryPostgres')
const EditOrderStatusPayload = require('../../../Domains/orders/Entities/EditOrderStatusPayload')

describe('OrderRepositoryPostgres', () => {
  afterEach(async () => {
    await OrderMenusTableTestHelper.cleanTable()
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

  describe('editOrder function', () => {
    it('should edit order correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })
      await MenusTableTestHelper.addMenus({ id: 'menu-125' })
      await OrdersTableTestHelper.addOrder({ id: 'order-123', tableNumber: 1, menus: ['menu-123', 'menu-124'] })
      const orderPayload = {
        tableNumber: 2,
        menus: [
          'menu-123',
          'menu-125'
        ]
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action
      await orderRepositoryPostgres.editOrder('order-123', orderPayload)

      // Assert
      const order = await OrdersTableTestHelper.findOrdersById('order-123')
      expect(order).toBeDefined()
      expect(order.tableNumber).toEqual('2')
      expect(order.menus[0].id).toEqual('menu-123')
      expect(order.menus[1].id).toEqual('menu-125')
    })

    it('should edit order correctly when menus is empty', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })
      await MenusTableTestHelper.addMenus({ id: 'menu-125' })
      await OrdersTableTestHelper.addOrder({ id: 'order-123', tableNumber: 1, menus: ['menu-123', 'menu-124'] })
      const orderPayload = {
        tableNumber: 2,
        menus: []
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action
      await orderRepositoryPostgres.editOrder('order-123', orderPayload)

      // Assert
      const order = await OrdersTableTestHelper.findOrdersById('order-123')
      expect(order).toBeDefined()
      expect(order.tableNumber).toEqual('2')
      expect(order.menus[0].id).toEqual('menu-123')
      expect(order.menus[1].id).toEqual('menu-124')
    })

    it('should throw NotFoundError if order is not found', async () => {
      // Arrange
      const orderPayload = {
        tableNumber: 2,
        menus: []
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action & Assert
      await expect(orderRepositoryPostgres.editOrder('order-123', orderPayload)).rejects.toThrowError(NotFoundError)
    })
  })

  describe('editOrderStatus function', () => {
    it('should update order correctly', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const editOrderStatusPayload = new EditOrderStatusPayload({
        isPaid: true
      })

      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action
      await orderRepositoryPostgres.editOrderStatus('order-123', editOrderStatusPayload)

      // Assert
      const order = await OrdersTableTestHelper.findOrdersById('order-123')
      expect(order.isPaid).toEqual(editOrderStatusPayload.isPaid)
    })

    it('should throw NotFound Error when order is not found', async () => {
      // Arrange
      const editOrderStatusPayload = new EditOrderStatusPayload({
        isPaid: true
      })

      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action & Assert
      await expect(orderRepositoryPostgres.editOrderStatus('order-999', editOrderStatusPayload)).rejects.toThrowError(NotFoundError)
    })
  })
})
