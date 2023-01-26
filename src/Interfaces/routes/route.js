const UsersHandler = require('./handlers/UsersHandler')
const AuthenticationsHandler = require('./handlers/AuthenticationsHandler')
const MenusHandler = require('./handlers/Menushandler')

const routes = (app, container) => {
  const usersHandler = new UsersHandler(container)
  const authenticationsHandler = new AuthenticationsHandler(container)
  const menusHandler = new MenusHandler(container)

  app.get('/', (_, res) => {
    res.json('hello world')
  })

  // User
  app.post('/users', usersHandler.postUserHandler)

  // Auth
  app.post('/login', authenticationsHandler.postAuthenticationHandler)
  app.put('/refreshtoken', authenticationsHandler.putAuthenticationHandler)
  app.delete('/logout', authenticationsHandler.deleteAuthenticationHandler)

  // Menu
  app.post('/menus', menusHandler.postMenuHandler)
}

module.exports = routes
