const createServer = require('../../../../Infrastructures/http/createServer')
const test = require('supertest')
const container = require('../../../../Infrastructures/container')

describe('Middleware', () => {
  describe('responseError', () => {
    it('should return status 400 if error is Invariant Error', async () => {
      // Arrange
      const requestPayload = {
        username: 'faiqfananie',
        password: 'secret',
        role: 'pelayan'
      }
      const server = createServer(container)

      // Action
      const response = await test(server).post('/users').send(requestPayload)

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
})
