const container = require('../../../../Infrastructures/container')
const createServer = require('../../../../Infrastructures/http/createServer')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const test = require('supertest')
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager')

describe('/authentications endpoint', () => {
  let server
  beforeAll(async () => {
    server = createServer(container)
  })

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /authentications', () => {
    it('should response 201 and new authentication', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret'
      }

      await test(server).post('/users').send({
        username: 'faiqfananie',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      })

      // Action
      const response = await test(server).post('/login').send(requestPayload)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.accessToken).toBeDefined()
      expect(response.body.data.refreshToken).toBeDefined()
    })

    it('should response 400 if username not found', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret'
      }

      // Action
      const response = await test(server).post('/login').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('username tidak ditemukan')
    })

    it('should response 401 if password wrong', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'wrong_password'
      }
      // Add user
      await test(server).post('/users').send({
        username: 'faiqfananie',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      })

      // Action
      const response = await test(server).post('/login').send(requestPayload)

      // Assert
      expect(response.status).toEqual(401)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('kredensial yang Anda masukkan salah')
    })

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie'
      }

      // Action
      const response = await test(server).post('/login').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('harus mengirimkan username dan password')
    })

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 123,
        password: 'secret'
      }

      // Action
      const response = await test(server).post('/login').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('username dan password harus string')
    })
  })

  describe('when PUT /authentications', () => {
    it('should return 200 and new access token', async () => {
      // Arrange
      await test(server).post('/users').send({
        username: 'faiqfananie',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      })

      const loginResponse = await test(server).post('/login').send({
        username: 'faiqfananie',
        password: 'secret'
      })

      const refreshToken = loginResponse.body.data.refreshToken

      // Action
      const response = await test(server).put('/refreshtoken').send({ refreshToken })

      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.accessToken).toBeDefined()
    })

    it('should return 400 payload not contain refresh token', async () => {
      // Arrange & Action
      const response = await test(server).put('/refreshtoken').send({ refreshToke: '' })

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('harus mengirimkan token refresh')
    })

    it('should return 400 if refresh token not string', async () => {
      // Arrange & Action
      const response = await test(server).put('/refreshtoken').send({ refreshToken: 123 })

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('refresh token harus string')
    })

    it('should return 400 if refresh token not valid', async () => {
      // Arrange &  Action
      const response = await test(server).put('/refreshtoken').send({ refreshToken: 'invalid_refresh_token' })

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('refresh token tidak valid')
    })

    it('should return 400 if refresh token not registered in database', async () => {
      // Arrange
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ username: 'faiqfananie' })

      // Action
      const response = await test(server).put('/refreshtoken').send({ refreshToken })

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database')
    })
  })

  describe('when DELETE /authentications', () => {
    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const refreshToken = 'refresh_token'
      await AuthenticationsTableTestHelper.addToken(refreshToken)

      // Action
      const response = await test(server).delete('/logout').send({ refreshToken })

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
    })

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      const refreshToken = 'refresh_token'

      // Action
      const response = await test(server).delete('/logout').send({ refreshToken })

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database')
    })

    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange & Action
      const response = await test(server).delete('/logout').send({})

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('harus mengirimkan token refresh')
    })

    it('should response 400 if refresh token not string', async () => {
      // Arrange & Action
      const response = await test(server).delete('/logout').send({ refreshToken: 123 })

      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('refresh token harus string')
    })
  })
})
