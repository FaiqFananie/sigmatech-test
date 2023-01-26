const UsersHandler = require('./handlers/UsersHandler')
const AuthenticationsHandler = require('./handlers/AuthenticationsHandler')

const routes = (app, container) => {
  const usersHandler = new UsersHandler(container)
  const authenticationsHandler = new AuthenticationsHandler(container)

  app.get('/', (_, res) => {
    res.json('hello world')
  })

  // User
  app.post('/users', usersHandler.postUserHandler)

  // Auth
  app.post('/login', authenticationsHandler.postAuthenticationHandler)
  app.put('/refreshtoken', authenticationsHandler.putAuthenticationHandler)
  app.delete('/logout', authenticationsHandler.deleteAuthenticationHandler)
}

module.exports = routes
