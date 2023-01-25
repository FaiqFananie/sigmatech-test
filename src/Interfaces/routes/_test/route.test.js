const createServer = require('../../../Infrastructures/http/createServer')
const test = require('supertest')

describe('HTTP server', () => {
  it('should response 200 when request unregistered route', async () => {
    // Arrange
    const server = createServer()

    // Action
    return test(server).get('/').expect(200)
  })
})
