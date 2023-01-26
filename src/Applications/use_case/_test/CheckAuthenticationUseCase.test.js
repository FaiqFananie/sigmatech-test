const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const CheckAuthenticationUseCase = require('../CheckAuthenticationUseCase')
const UserRepository = require('../../../Domains/users/UserRepository')

describe('RefreshAuthenticationUseCase', () => {
  it('should orchestrating the check authentication action correctly', async () => {
    // Arrange
    const headers = 'some_access_token'
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockUserRepository = new UserRepository()

    // Mocking
    mockAuthenticationTokenManager.verifyAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }))
    mockUserRepository.checkIdAuth = jest.fn()
      .mockImplementation(() => Promise.resolve())

    // Create the use case instace
    const checkAuthenticationUseCase = new CheckAuthenticationUseCase({
      authenticationTokenManager: mockAuthenticationTokenManager,
      userRepository: mockUserRepository
    })

    // Action
    await checkAuthenticationUseCase.execute(headers)

    // Assert
    expect(mockAuthenticationTokenManager.verifyAccessToken)
      .toBeCalledWith(headers)
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(headers)
    expect(mockUserRepository.checkIdAuth)
      .toBeCalledWith('user-123')
  })
})
