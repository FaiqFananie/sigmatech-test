const MenuPayload = require('../../../Domains/menus/entities/MenuPayload')
const MenuRepository = require('../../../Domains/menus/MenuRepository')
const AddMenuUseCase = require('../AddMenuUseCase')

describe('AddMenuUseCase', () => {
  it('should orchestrating the add menu action correctly', async () => {
    // Arrange
    const useCasePayload = {
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }

    const idMenu = 'menu-123'

    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.addMenu = jest.fn()
      .mockImplementation(() => Promise.resolve(idMenu))

    const addMenuUseCase = new AddMenuUseCase({
      menuRepository: mockMenuRepository
    })

    // Action
    const newMenu = await addMenuUseCase.execute(useCasePayload)

    // Assert
    expect(newMenu).toStrictEqual(idMenu)
    expect(mockMenuRepository.addMenu).toBeCalledWith(new MenuPayload({
      name: useCasePayload.name,
      type: useCasePayload.type,
      ready: useCasePayload.ready,
      price: useCasePayload.price
    }))
  })
})
