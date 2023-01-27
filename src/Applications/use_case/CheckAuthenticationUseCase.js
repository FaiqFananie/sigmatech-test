class CheckAuthenticationUseCase {
  constructor ({
    authenticationTokenManager,
    userRepository
  }) {
    this._authenticationTokenManager = authenticationTokenManager
    this._userRepository = userRepository
  }

  async execute (headers) {
    await this._authenticationTokenManager.verifyAccessToken(headers)

    const { id, username, role } = await this._authenticationTokenManager.decodePayload(headers)
    await this._userRepository.checkIdAuth(id)

    return { id, username, role }
  }
}

module.exports = CheckAuthenticationUseCase
