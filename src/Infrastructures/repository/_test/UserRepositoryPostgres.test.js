const UsersTableTestHelper = require('../../../tests/UsersTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const User = require('../../../../models/User')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username already used', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }) // memasukan user baru dengan username dicoding
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError)
    })
  })

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        role: 'pelayan'
      })
      const fakeIdGenerator = () => '123' // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(User, fakeIdGenerator)

      // Action
      await userRepositoryPostgres.addUser(registerUser)

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123')
      expect(users).toBeDefined()
    })
  })
})
