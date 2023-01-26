const createServer = require('../../../../Infrastructures/http/createServer')
const test = require('supertest')
const container = require('../../../../Infrastructures/container')

let loginResponse
let server
describe('Middleware', () => {
  describe('responseError', () => {
    it('should return status 404 when error is Not Found Error', async () => {
      // Arrange
      const server = createServer(container)

      // Action
      const response = await test(server).post('/test')

      // Assert
      expect(response.statusCode).toEqual(404)
    })

    it('should return status 400 when error is Invariant Error', async () => {
      // Arrange
      const payload = {
        fullname: 'Faiq Zigo Fananie',
        username: 'FaiqFananie',
        password: 'secret'
      }
      const server = createServer(container)

      // Action
      const response = await test(server).post('/users').send(payload)

      // Assert
      expect(response.statusCode).toEqual(400)
    })

    it('should return status 500 when server error', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret',
        role: 'pelayan'
      }
      const server = createServer({})

      // Action
      const response = await test(server).post('/users').send(requestPayload)

      // Assert
      expect(response.statusCode).toEqual(500)
    })
  })

  describe('checkAuth', () => {
    beforeAll(async () => {
      server = createServer(container)

      await test(server).post('/users').send({
        username: 'faiqfananie1',
        password: 'secret1',
        fullname: 'Faiq Fananie',
        role: 'pelayan'
      })

      loginResponse = await test(server).post('/login').send({
        username: 'faiqfananie1',
        password: 'secret1'
      })
    })

    it('should return status 201 if authorization header is valid', async () => {
      // Arrange

      const accessToken = loginResponse.body.data.accessToken

      const payload = {
        name: 'Nasi Goreng',
        type: 'makanan',
        ready: true,
        price: 20000
      }

      // Action
      const response = await test(server).post('/menus').send(payload).set('Authorization', `Bearer ${accessToken}`)

      // Assert
      expect(response.status).toEqual(201)
    })
  })

  it('should return status 401 if authorization header is not valid', async () => {
    // Arrange
    const accessToken = loginResponse.body.data.refreshToken

    const payload = {
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }

    // Action
    const response = await test(server).post('/menus').send(payload).set('Authorization', `Bearer ${accessToken}`)

    // Assert
    expect(response.status).toEqual(401)
  })

  it('should return status 401 if authorization header is empty', async () => {
    // Arrange
    const payload = {
      name: 'Nasi Goreng',
      type: 'makanan',
      ready: true,
      price: 20000
    }

    // Action
    const response = await test(server).post('/menus').send(payload)

    // Assert
    expect(response.status).toEqual(401)
  })
})
