const MenuRepository = require('../../../Domains/menus/MenuRepository')
const DeleteMenuUseCase = require('../DeleteMenuUseCase')

describe('DeleteMenuUseCase', () => {
  it('should orchestrating the get menu action correctly', async () => {
    // Arrange
    const id = 'menu-123'

    const mockMenuRepository = new MenuRepository()
    mockMenuRepository.verifyAvailableMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockMenuRepository.deleteMenu = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteMenuUseCase = new DeleteMenuUseCase({
      menuRepository: mockMenuRepository
    })

    // Action
    await deleteMenuUseCase.execute(id)

    // Arrange
    expect(mockMenuRepository.verifyAvailableMenu).toBeCalledWith(id, 'delete')
    expect(mockMenuRepository.deleteMenu).toBeCalledWith(id)
  })
})
