const MenusTableTestHelper = require('../../../tests/MenusTableTestHelper')
const MenuPayload = require('../../../Domains/menus/entities/MenuPayload')
const MenuRepositoryPostgres = require('../MenuRepositoryPostgres')
const Menu = require('../../../../models/menu')

describe('MenuRepositoryPostgres', () => {
  afterEach(async () => {
    await MenusTableTestHelper.cleanTable()
  })

  describe('addMenu function', () => {
    it('should persist menu and return id correctly', async () => {
      // Arrange
      const menuPayload = new MenuPayload({
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      })
      const fakeIdGenerator = () => '123'
      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, fakeIdGenerator)

      // Action
      await menuRepositoryPostgres.addMenu(menuPayload)

      // Assert
      const menu = await MenusTableTestHelper.findMenusById('menu-123')
      expect(menu).toBeDefined()
    })
  })
})
