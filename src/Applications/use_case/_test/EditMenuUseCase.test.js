const MenuPayload = require('../../../Domains/menus/entities/MenuPayload')
const MenuRepository = require('../../../Domains/menus/MenuRepository')
const EditMenuUseCase = require('../EditMenuUseCase')

describe('EditMenuUseCase', () => {
  it('should orchestrating the edit menu action correctly', async () => {
    // Arrange
    const useCasePayload = {
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }

    const idMenu = 'menu-123'

    const mockMenuRepository = new MenuRepository()

    mockMenuRepository.editMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const editMenuUseCase = new EditMenuUseCase({
      menuRepository: mockMenuRepository
    })

    // Action
    await editMenuUseCase.execute(idMenu, useCasePayload)

    // Assert
    expect(mockMenuRepository.editMenu).toBeCalledWith(idMenu, new MenuPayload({
      name: useCasePayload.name,
      type: useCasePayload.type,
      ready: useCasePayload.ready,
      price: useCasePayload.price
    }))
  })
})
