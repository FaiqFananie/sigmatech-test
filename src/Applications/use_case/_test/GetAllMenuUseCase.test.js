const MenuRepository = require('../../../Domains/menus/MenuRepository')
const GetAllMenuUseCase = require('../GetAllMenuUseCase')

describe('GetAllMenuUseCase', () => {
  it('should orchestrating the get all menu action correctly', async () => {
    // Arrange
    const expectedResult = [{
      id: 'menu-123',
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }]

    const mockMenuRepository = new MenuRepository()
    mockMenuRepository.getMenus = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        id: 'menu-123',
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }]))

    const getMenuUseCase = new GetAllMenuUseCase({
      menuRepository: mockMenuRepository
    })

    // Action
    const result = await getMenuUseCase.execute()

    // Arrange
    expect(result).toEqual(expectedResult)
    expect(mockMenuRepository.getMenus).toBeCalled()
  })
})
