const InvariantError = require('../../Commons/exceptions/InvariantError')
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor (model) {
    super()
    this._auth = model
  }

  async addToken (token) {
    await this._auth.create({
      token
    })
  }

  async checkAvailabilityToken (token) {
    const auth = await this._auth.findOne({ where: { token } })

    if (!auth) {
      throw new InvariantError('refresh token tidak ditemukan di database')
    }
  }

  async deleteToken (token) {
    await this._auth.destroy({ where: { token } })
  }
}

module.exports = AuthenticationRepositoryPostgres
