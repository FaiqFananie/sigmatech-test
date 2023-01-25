const UsersHandler = require('./handlers/UsersHandler')

const routes = (app, container) => {
  const usersHandler = new UsersHandler(container)

  app.get('/', (_, res) => {
    res.json('hello world')
  })

  app.post('/users', usersHandler.postUserHandler)
}

module.exports = routes
