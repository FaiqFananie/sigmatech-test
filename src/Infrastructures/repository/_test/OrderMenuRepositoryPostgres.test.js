const OrderMenusTableTestHelper = require('../../../tests/OrderMenusTableTestHelper')
const MenusTableTestHelper = require('../../../tests/MenusTableTestHelper')
const OrdersTableTestHelper = require('../../../tests/OrdersTableTestHelper')
const OrderMenuRepositoryPostgres = require('../OrderMenuRepositoryPostgres')
const { OrderMenu } = require('../../../../models/menu_order')

describe('OrderMenuRepositoryPostgres', () => {
  afterEach(async () => {
    await OrderMenusTableTestHelper.cleanTable()
    await MenusTableTestHelper.cleanTable()
    await OrdersTableTestHelper.cleanTable()
  })

  describe('removeRelation function', () => {
    it('should remove orderMenu with orderId correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })
      await OrdersTableTestHelper.addOrder({ id: 'order-123', menus: ['menu-123', 'menu-124'] })

      // Action
      const orderMenuRepositoryPostgres = new OrderMenuRepositoryPostgres(OrderMenu)

      await orderMenuRepositoryPostgres.removeRelation('order-123')

      // Arrange
      const order = await OrdersTableTestHelper.findOrdersById('order-123')
      expect(order.menus).toEqual([])
    })
  })
})
