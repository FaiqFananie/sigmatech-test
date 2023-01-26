/* istanbul ignore file */
const Authentication = require('../../models/authentication')

const AuthenticationsTableTestHelper = {
  async addToken (token) {
    await Authentication.create({ token })
  },

  async findToken (token) {
    const result = await Authentication.findOne({ where: { token } })

    return result
  },
  async cleanTable () {
    await Authentication.destroy({ truncate: true })
  }
}

module.exports = AuthenticationsTableTestHelper
