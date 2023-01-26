class CheckAuthenticationUseCase {
  constructor ({
    authenticationRepository,
    authenticationTokenManager,
    userRepository
  }) {
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
    this._userRepository = userRepository
  }

  async execute (headers) {
    this._verifyPayload(headers)
    await this._authenticationTokenManager.verifyAccessToken(headers)

    const { id } = await this._authenticationTokenManager.decodePayload(headers)
    await this._userRepository.checkIdAuth(id)
  }

  _verifyPayload (headers) {
    if (!headers) {
      throw new Error('CHECK_AUTHENTICATION_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN')
    }

    if (typeof headers !== 'string') {
      throw new Error('CHECK_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = CheckAuthenticationUseCase
