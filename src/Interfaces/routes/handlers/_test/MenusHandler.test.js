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
      expect(response.body.message).toEqual('properti yang dibutuhkan belum cukup')
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
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })
  })

  describe('when GET /menus/:id', () => {
    it('should throw status 404 when menu is not found', async () => {
      // Arrange & Action
      const response = await test(server).get('/menus/menu-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu tidak ditemukan')
    })

    it('should throw status 200 when menu is found', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })

      // Action
      const response = await test(server).get('/menus/menu-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toBeDefined()
    })
  })

  describe('when GET /menus', () => {
    it('should return empty array when menu is not found', async () => {
      // Arrange & Action
      const response = await test(server).get('/menus').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toEqual([])
    })

    it('should return array of menus when menu is found', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })

      // Action
      const response = await test(server).get('/menus').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.data).toBeDefined()
    })
  })

  describe('when PUT /menus/:id', () => {
    it('should return status 404 when menu is not found', async () => {
      // Arrange
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }

      // Action
      const response = await test(server).put('/menus/menu-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu gagal diperbarui, Id tidak ditemukan')
    })

    it('should return status 400 when request payload not contain needed property', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true
      }

      // Action
      const response = await test(server).put('/menus/menu-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('properti yang dibutuhkan belum cukup')
    })

    it('should return status 400 when request payload not meet data type specification', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const requestPayload = {
        name: 'Nasi Goreng',
        type: [],
        ready: true,
        price: 20000
      }

      // Action
      const response = await test(server).put('/menus/menu-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('tipe data tidak sesuai')
    })

    it('should update menu when menu is found', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123' })
      const requestPayload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }

      // Action
      const response = await test(server).put('/menus/menu-123').send(requestPayload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.message).toEqual('Menu berhasil diperbarui')
    })
  })

  describe('when DELETE /menus/:id', () => {
    it('should return status 404 when menu is not found', async () => {
      // Arrange & Action
      const response = await test(server).delete('/menus/menu-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(404)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu tidak ditemukan')
    })

    it('should return status 400 when menu is still ready', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123', ready: true })

      // Action
      const response = await test(server).delete('/menus/menu-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(400)
      expect(response.body.status).toEqual('fail')
      expect(response.body.message).toEqual('Menu ini masih tersedia')
    })

    it('should return status 200 when all condition fulfilled', async () => {
      // Arrange
      await MenusTableTestHelper.addMenus({ id: 'menu-123', ready: false })

      // Action
      const response = await test(server).delete('/menus/menu-123').set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(200)
      expect(response.body.status).toEqual('success')
      expect(response.body.message).toEqual('Menu berhasil dihapus')
    })
  })
})
