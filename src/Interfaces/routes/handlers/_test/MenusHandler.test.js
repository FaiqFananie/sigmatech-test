const container = require('../../../../Infrastructures/container')
const createServer = require('../../../../Infrastructures/http/createServer')
const MenusTableTestHelper = require('../../../../tests/MenusTableTestHelper')

const test = require('supertest')

describe('/menus endpoint', () => {
  let server
  let accessToken
  beforeAll(async () => {
    server = createServer(container)
    await test(server).post('/users').send({
      username: 'faiqfananie2',
      password: 'secret2',
      fullname: 'Faiq Fananie',
      role: 'pelayan'
    })

    const loginResponse = await test(server).post('/login').send({
      username: 'faiqfananie2',
      password: 'secret2'
    })

    accessToken = loginResponse.body.data.accessToken
  })

  afterEach(async () => {
    await MenusTableTestHelper.cleanTable()
  })

  describe('when POST /menus', () => {
    it('should response 201 and persisted user', async () => {
      // Arrange
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }

      // Action
      const response = await test(server).post('/menus').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.id).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan'
      }

      // Action
      const response = await test(server).post('/menus').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat menu baru karena properti yang dibutuhkan tidak ada')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: [],
        price: 20000
      }

      // Action
      const response = await test(server).post('/menus').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat menu baru karena tipe data tidak sesuai')
    })
  })
})
