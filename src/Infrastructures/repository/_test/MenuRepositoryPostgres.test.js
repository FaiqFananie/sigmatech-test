const MenusTableTestHelper = require('../../../tests/MenusTableTestHelper')
const MenuPayload = require('../../../Domains/menus/entities/MenuPayload')
const MenuRepositoryPostgres = require('../MenuRepositoryPostgres')
const Menu = require('../../../../models/menu')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const InvariantError = require('../../../Commons/exceptions/InvariantError')

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

  describe('editMenu function', () => {
    it('should persist menu correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const menuPayload = new MenuPayload({
        name: 'Nasi Goreng Gila',
        type: 'minuman',
        ready: true,
        price: 25000
      })

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action
      await menuRepositoryPostgres.editMenu('menu-123', menuPayload)

      // Assert
      const menu = await MenusTableTestHelper.findMenusById('menu-123')
      expect(menu.name).toEqual(menuPayload.name)
      expect(menu.type).toEqual(menuPayload.type)
      expect(menu.ready).toEqual(menuPayload.ready)
      expect(menu.price).toEqual(menuPayload.price)
    })

    it('should throw NotFound Error when menu is not found', async () => {
      // Arrange
      const menuPayload = new MenuPayload({
        name: 'Nasi Goreng Gila',
        type: 'minuman',
        ready: true,
        price: 25000
      })

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action & Assert
      await expect(menuRepositoryPostgres.editMenu('menu-999', menuPayload)).rejects.toThrowError(NotFoundError)
    })
  })

  describe('verifyAvailableMenu function', () => {
    it('should persist menu correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action & Assert
      await expect(menuRepositoryPostgres.verifyAvailableMenu('menu-123')).resolves.not.toThrowError()
    })

    it('should throw InvariantError when menu is not ready', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-124', ready: false })

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action & Assert
      await expect(menuRepositoryPostgres.verifyAvailableMenu('menu-124')).rejects.toThrowError(InvariantError)
    })

    it('should throw NotFoundError when menu is not found', async () => {
      // Arrange

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      /// Action & Assert
      await expect(menuRepositoryPostgres.verifyAvailableMenu('menu-999')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('getMenuById function', () => {
    it('should return menu data correctly', async () => {
      // Arrange
      const menuPayload = {
        id: 'menu-123',
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }
      await MenusTableTestHelper.addMenus(menuPayload)

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action
      const menu = await menuRepositoryPostgres.getMenuById('menu-123')

      // Assert
      expect(menu.id).toEqual(menuPayload.id)
      expect(menu.name).toEqual(menuPayload.name)
      expect(menu.type).toEqual(menuPayload.type)
      expect(menu.ready).toEqual(menuPayload.ready)
      expect(menu.price).toEqual(menuPayload.price)
    })

    it('should throw NotFoundError when menu is not found', async () => {
      // Arrange

      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action & Assert
      await expect(menuRepositoryPostgres.getMenuById('menu-999')).rejects.toThrowError(NotFoundError)
    })
  })

  describe('getMenus function', () => {
    it('should return menu data correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action
      const menu = await menuRepositoryPostgres.getMenus()

      // Assert
      expect(typeof menu).toEqual('object')
      expect(menu.length).toEqual(1)
    })
  })

  it('should return empty array =', async () => {
    // Arrange
    const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

    // Action
    const menu = await menuRepositoryPostgres.getMenus()

    // Assert
    expect(typeof menu).toEqual('object')
    expect(menu.length).toEqual(0)
  })

  describe('deleteMenu function', () => {
    it('should delete menu correctly', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

      // Action & Assert
      await expect(menuRepositoryPostgres.deleteMenu('menu-123')).resolves.not.toThrowError(NotFoundError)
    })
  })

  it('should throw NotFoundError when menu is not found =', async () => {
    // Arrange
    const menuRepositoryPostgres = new MenuRepositoryPostgres(Menu, {})

    // Action & Assert
    await expect(menuRepositoryPostgres.deleteMenu('menu-999')).rejects.toThrowError(NotFoundError)
  })
})
