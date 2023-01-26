const MenuRepository = require('../MenuRepository')

describe('Menu Repository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const menuRepository = new MenuRepository()

    // Assert
    await expect(menuRepository.addMenu('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(menuRepository.editMenu('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(menuRepository.verifyAvailableMenu('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(menuRepository.getMenuById('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(menuRepository.getMenus('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(menuRepository.deleteMenu('')).rejects.toThrowError('MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
