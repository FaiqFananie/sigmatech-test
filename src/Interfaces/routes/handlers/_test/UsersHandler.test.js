const createServer = require('../../../../Infrastructures/http/createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const test = require('supertest')
const container = require('../../../../Infrastructures/container')

describe('/users endpoint', () => {
  let server
  beforeAll(async () => {
    server = createServer(container)
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /users', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.id).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Faiq Fananie',
        password: 'secret'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret',
        fullname: ['Faiq Fananie'],
        role: 'pelayan'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai')
    })

    it('should response 400 when username more than 50 character', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananiefds;lm;lsdmv;lsmdf[dsmfkdnsvoiwhfoinvslcnvdoifnapdnclvnwobfowe',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit')
    })

    it('should response 400 when username contain restricted character', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiq fananie',
        password: 'secret',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.statusCode).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang')
    })

    it('should response 400 when username unavailable', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'faiqfananie' })
      const requestPayload = {
        username: 'faiqfananie',
        fullname: 'Faiq Fananie',
        password: 'super_secret',
        role: 'pelayan'
      }

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Username telah digunakan')
    })
  })
})
