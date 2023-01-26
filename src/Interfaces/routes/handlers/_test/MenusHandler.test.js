const container = require('../../../../Infrastructures/container')
const createServer = require('../../../../Infrastructures/http/createServer')
const MenusTableTestHelper = require('../../../../tests/MenusTableTestHelper')
const test = require('supertest')

describe('/menus endpoint', () => {
  let server
  beforeAll(async () => {
    server = createServer(container)
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
      const response = await test(server).post('/menus').send(requestPayload)

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
      const response = await test(server).post('/menus').send(requestPayload)

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
      const response = await test(server).post('/menus').send(requestPayload)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tidak dapat membuat menu baru karena tipe data tidak sesuai')
    })
  })
})
