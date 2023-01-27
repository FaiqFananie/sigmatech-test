const { Order } = require('../../../../models/menu_order')
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
        menus: []
      }
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action & Assert
      await expect(orderRepositoryPostgres.addOrder('order-123', orderPayload)).rejects.toThrowError(Error)
    })
  })

  describe('countOrders function', () => {
    it('should return total number of order', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      await OrdersTableTestHelper.addOrder({ id: 'order-124' })
      const orderRepositoryPostgres = new OrderRepositoryPostgres(Order)

      // Action
      const count = await orderRepositoryPostgres.countOrders()

      // Assert
      expect(count).toEqual(2)
    })
  })
})
