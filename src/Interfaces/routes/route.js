const container = require('../../Infrastructures/container')
const UsersHandler = require('./handlers/UsersHandler')

const usersHandler = new UsersHandler(container)

const routes = (app) => {
  app.get('/', (_, res) => {
    res.json('hello world')
  })

  app.post('/users', usersHandler.postUserHandler)
}

module.exports = routes
