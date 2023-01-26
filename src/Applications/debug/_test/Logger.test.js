const Logger = require('../Logger')

describe('Logger', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const logger = new Logger()

    // Assert
    await expect(logger.printLog('')).rejects.toThrowError('LOGGER.METHOD_NOT_IMPLEMENTED')
  })
})
