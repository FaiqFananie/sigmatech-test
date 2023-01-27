const UsersTableTestHelper = require('../../../tests/UsersTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const User = require('../../../../models/user')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username already used', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'faiq' })
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('faiq')).rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('faiq')).resolves.not.toThrowError(InvariantError)
    })
  })

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'faiqfananie',
        password: 'secret_password',
        fullname: 'Faiq Fananie',
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

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByUsername('faiqfananie'))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})
      await UsersTableTestHelper.addUser({
        username: 'faiqfananie',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('faiqfananie')
      expect(password).toBe('secret_password')
    })
  })

  describe('getIdByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername('faiqfananie'))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'faiqfananie', role: 'pelayan' })
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action
      const { id, role } = await userRepositoryPostgres.getIdByUsername('faiqfananie')

      // Assert
      expect(id).toEqual('user-321')
      expect(role).toEqual('pelayan')
    })
  })

  describe('chechIdAuth', () => {
    it('should throw AuthenticationError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.checkIdAuth('user-999'))
        .rejects
        .toThrowError(AuthenticationError)
    })

    it('should not throw Authentication Error when user valid', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'faiqfananie' })
      const userRepositoryPostgres = new UserRepositoryPostgres(User, {})

      // Action & Assert
      await expect(userRepositoryPostgres.checkIdAuth('user-321'))
        .resolves
        .not.toThrow(AuthenticationError)
    })
  })
})
