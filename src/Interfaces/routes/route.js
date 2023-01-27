const UsersHandler = require('./handlers/UsersHandler')
const AuthenticationsHandler = require('./handlers/AuthenticationsHandler')
const MenusHandler = require('./handlers/MenusHandler')

const routes = (app, container, middleware) => {
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
  app.post('/menus', middleware.checkAuth, menusHandler.postMenuHandler)
  app.get('/menus/:id', middleware.checkAuth, menusHandler.getMenuHandler)
  app.get('/menus', middleware.checkAuth, menusHandler.getAllMenuHandler)
  app.put('/menus/:id', middleware.checkAuth, menusHandler.editMenuHandler)
  app.delete('/menus/:id', middleware.checkAuth, menusHandler.deleteMenuHandler)
}

module.exports = routes
