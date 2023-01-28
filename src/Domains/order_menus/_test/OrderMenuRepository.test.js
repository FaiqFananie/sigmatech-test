const OrderMenuRepository = require('../OrderMenuRepository')

describe('OrderMenuRepository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const orderMenuRepository = new OrderMenuRepository()

    // Assert
    await expect(orderMenuRepository.removeRelation('')).rejects.toThrowError('ORDER_MENU_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
