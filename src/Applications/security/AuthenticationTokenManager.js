class AuthenticationTokenManager {
  async createAccessToken () {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async createRefreshToken () {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async verifyRefreshToken () {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAccessToken () {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async decodePayload () {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = AuthenticationTokenManager
