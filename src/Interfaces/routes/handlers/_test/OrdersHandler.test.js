const container = require('../../../../Infrastructures/container')
const createServer = require('../../../../Infrastructures/http/createServer')
const MenusTableTestHelper = require('../../../../tests/MenusTableTestHelper')
const OrdersTableTestHelper = require('../../../../tests/OrdersTableTestHelper')

const test = require('supertest')
const OrderMenusTableTestHelper = require('../../../../tests/OrderMenusTableTestHelper')

describe('/orders endpoint', () => {
  let server
  let accessToken
  let accessToken2
  let accessToken3
  let response1
  beforeAll(async () => {
    server = createServer(container)
    response1 = await test(server).post('/users').send({
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

    await test(server).post('/users').send({
      username: 'faiqfananie5',
      password: 'secret5',
      fullname: 'Faiq Fananie',
      role: 'kasir'
    })

    const loginResponse = await test(server).post('/login').send({
      username: 'faiqfananie3',
      password: 'secret3'
    })

    const loginResponse2 = await test(server).post('/login').send({
      username: 'faiqfananie4',
      password: 'secret4'
    })

    const loginResponse3 = await test(server).post('/login').send({
      username: 'faiqfananie5',
      password: 'secret5'
    })

    accessToken = loginResponse.body.data.accessToken
    accessToken2 = loginResponse2.body.data.accessToken
    accessToken3 = loginResponse3.body.data.accessToken
  })

  afterEach(async () => {
    await OrderMenusTableTestHelper.cleanTable()
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
        createdBy: 'user-123',
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
        createdBy: 'user-123',
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
        isPaid: [],
        createdBy: 'user-123'
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })

    it('should return status 400 when Menu is not ready yet', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123', ready: true })
      await MenusTableTestHelper.addMenus({ id: 'menu-124', ready: false })
      const requestPayload = {
        tableNumber: 1,
        isPaid: false,
        menus: [
          'menu-123',
          'menu-124'
        ],
        createdBy: 'user-123'
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu ini sedang tidak tersedia')
    })

    it('should response 403 when user has no access', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1,
        isPaid: [],
        createdBy: 'user-123'
      }

      // Action
      const response = await test(server).post('/orders').send(requestPayload).set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })
  })

  describe('when GET /orders/:id', () => {
    it('should throw status 404 when menu is not found', async () => {
      // Arrange & Action
      const response = await test(server).get('/orders/order-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Order tidak ditemukan')
    })

    it('should throw status 200 when menu is found', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123', createdBy: response1.body.data.id })

      // Action
      const response = await test(server).get('/orders/order-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toBeDefined()
    })

    it('should response 403 when user has no access', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).get('/orders/order-123').set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })
  })

  describe('when GET /orders', () => {
    it('should return empty array when order is not found', async () => {
      // Arrange & Action
      const response = await test(server).get('/orders').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toEqual([])
    })

    it('should return array of orders when orders is found', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).get('/orders').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toBeDefined()
    })

    it('should response 403 when user has no access', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).get('/orders').set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })
  })

  describe('when PUT /orders/:id', () => {
    it('should return status 404 when order is not found', async () => {
      // Arrange
      const requestPayload = {
        tableNumber: 1
      }

      // Action
      const response = await test(server).put('/orders/order-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Order gagal diperbarui, Id tidak ditemukan')
    })

    it('should return status 400 when request payload not contain needed property', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).put('/orders/order-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('properti yang dibutuhkan belum cukup')
    })

    it('should return status 400 when request payload not meet data type specification', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        tableNumber: []
      }

      // Action
      const response = await test(server).put('/orders/order-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })

    it('should return status 400 when Menu is not ready yet', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123', ready: false })
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        tableNumber: 1,
        menus: ['menu-123']
      }

      // Action
      const response = await test(server).put('/orders/order-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu ini sedang tidak tersedia')
    })

    it('should return status 403 when user has no access', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        tableNumber: 1
      }

      // Action
      const response = await test(server).put('/orders/order-123').send(requestPayload).set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })

    it('should update order when order is found', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123', tableNumber: 1 })
      const requestPayload = {
        tableNumber: 2
      }

      // Action
      const response = await test(server).put('/orders/order-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.message).toEqual('Order berhasil diperbarui')
    })
  })

  describe('when PUT /orders/:id/status', () => {
    it('should return status 404 when order is not found', async () => {
      // Arrange
      const requestPayload = {
        isPaid: true
      }

      // Action
      const response = await test(server).put('/orders/order-123/status').send(requestPayload).set('Authorization', `Bearer ${accessToken3}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Order gagal diperbarui, Id tidak ditemukan')
    })

    it('should return status 400 when request payload not contain needed property', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).put('/orders/order-123/status').set('Authorization', `Bearer ${accessToken3}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('properti yang dibutuhkan belum cukup')
    })

    it('should return status 400 when request payload not meet data type specification', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        isPaid: []
      }

      // Action
      const response = await test(server).put('/orders/order-123/status').send(requestPayload).set('Authorization', `Bearer ${accessToken3}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })

    it('should return status 403 when user has no access', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        isPaid: true
      }

      // Action
      const response = await test(server).put('/orders/order-123/status').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })

    it('should update order when order is found', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })
      const requestPayload = {
        isPaid: true
      }

      // Action
      const response = await test(server).put('/orders/order-123/status').send(requestPayload).set('Authorization', `Bearer ${accessToken3}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.message).toEqual('Order berhasil diperbarui')
    })
  })

  describe('when DELETE /orders/:id', () => {
    it('should return status 404 when order is not found', async () => {
      // Arrange & Action
      const response = await test(server).delete('/orders/order-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Order gagal dihapus, Id tidak ditemukan')
    })

    it('should return status 403 when user has no access', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).delete('/orders/order-123').set('Authorization', `Bearer ${accessToken2}`)

      // Assert
      expect(response.status).toEqual(403)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Anda tidak punya akses untuk aksi ini')
    })

    it('should return status 200 when all condition fulfilled', async () => {
      // Arrange
      await OrdersTableTestHelper.addOrder({ id: 'order-123' })

      // Action
      const response = await test(server).delete('/orders/order-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.message).toEqual('Order berhasil dihapus')
    })
  })
})
