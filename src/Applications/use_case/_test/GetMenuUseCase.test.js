const MenuRepository = require('../../../Domains/menus/MenuRepository')
const GetMenuUseCase = require('../GetMenuUseCase')

describe('GetMenuUseCase', () => {
  it('should orchestrating the get menu action correctly', async () => {
    // Arrange
    const id = 'menu-123'
    const expectedResult = {
      id,
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }

    const mockMenuRepository = new MenuRepository()
    mockMenuRepository.getMenuById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id,
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }))

    const getMenuUseCase = new GetMenuUseCase({
      menuRepository: mockMenuRepository
    })

    // Action
    const result = await getMenuUseCase.execute(id)

    // Arrange
    expect(result).toEqual(expectedResult)
    expect(mockMenuRepository.getMenuById).toBeCalledWith(id)
  })
})
