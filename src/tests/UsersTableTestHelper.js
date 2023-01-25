/* istanbul ignore file */
const User = require('../../models/User')

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-123', fullname = 'Faiq Fananie', password = 'secret', username = 'faiqfananie', role = 'pelayan'
  }) {
    const newUser = await User.create({
      id,
      fullname,
      username,
      password,
      role
    })

    return newUser.id
  },

  async findUsersById (id) {
    const user = await User.findOne({ where: { id } })

    return user
  },

  async cleanTable () {
    await User.destroy({ truncate: true })
  }
}

module.exports = UsersTableTestHelper
