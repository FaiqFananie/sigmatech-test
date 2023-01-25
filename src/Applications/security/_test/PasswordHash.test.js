const PasswordHash = require('../PasswordHash')

describe('PasswordHash', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const passwordHash = new PasswordHash()

    // Assert
    await expect(passwordHash.hash('')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
    await expect(passwordHash.comparePassword('')).rejects.toThrowError('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  })
})
