const UserRepository = require('../UserRepository')

describe('User Repository', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const userRepository = new UserRepository()

    // Assert
    await expect(userRepository.addUser('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.verifyAvailableUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.getPasswordByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    await expect(userRepository.getIdByUsername('')).rejects.toThrowError('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  })
})
