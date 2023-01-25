const InvariantError = require('../../Commons/exceptions/InvariantError')
// const RegisteredUser = require('../../Domains/users/entities/RegisteredUser')
const UserRepository = require('../../Domains/users/UserRepository')

class UserRepositoryPostgres extends UserRepository {
  constructor (model, idGenerator) {
    super()
    this._user = model
    this._idGenerator = idGenerator
  }

  async verifyAvailableUsername (username) {
    const user = await this._user.findOne({ where: { username } })
    if (user) {
      throw new InvariantError('Username telah digunakan')
    }
  }

  async addUser (registerUser) {
    const { username, password, fullname, role } = registerUser
    const id = `user-${this._idGenerator()}`

    const newUser = await this._user.create({
      id,
      fullname,
      username,
      password,
      role
    })

    return newUser.id
  }
}

module.exports = UserRepositoryPostgres
