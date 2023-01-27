const container = require('../../../../Infrastructures/container')
const createServer = require('../../../../Infrastructures/http/createServer')
const MenusTableTestHelper = require('../../../../tests/MenusTableTestHelper')
const OrdersTableTestHelper = require('../../../../tests/OrdersTableTestHelper')

const test = require('supertest')

describe('/orders endpoint', () => {
  let server
  let accessToken
  let accessToken2
  beforeAll(async () => {
    server = createServer(container)
    await test(server).post('/users').send({
      username: 'faiqfananie3',
      password: 'secret3',
      fullname: 'Faiq Fananie',
      role: 'pelayan'
    })

    await test(server).post('/users').send({
      username: 'faiqfananie4',
      password: 'secret4',
      fullname: 'Faiq Fananie',
      role: 'admin'
    })

    const loginResponse = await test(server).post('/login').send({
      username: 'faiqfananie3',
      password: 'secret3'
    })

    const loginResponse2 = await test(server).post('/login').send({
      username: 'faiqfananie4',
      password: 'secret4'
    })

    accessToken = loginResponse.body.data.accessToken
    accessToken2 = loginResponse2.body.data.accessToken
  })

  afterEach(async () => {
    await MenusTableTestHelper.cleanTable()
    await OrdersTableTestHelper.cleanTable()
  })

  describe('when POST /orders', () => {
    it('should response 201 with correct payload', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      await MenusTableTestHelper.addMenus({ id: 'menu-124' })
      const requestPayload = {
        tableNumber: 1,
        isPaid: false,
        menus: [
          'menu-123',
          'menu-124'
        ]
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.id).toBeDefined()
    })

    it('should response 201 with empty menus', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1,
        isPaid: false
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(201)
      expect(response.body.status).toEqual('success')
      expect(response.body.data.id).toBeDefined()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('properti yang dibutuhkan belum cukup')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1,
        isPaid: []
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })

    it('should response 403 when user has no access', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1,
        isPaid: []
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })
  })
})
