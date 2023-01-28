const UsersHandler = require('./handlers/UsersHandler')
const AuthenticationsHandler = require('./handlers/AuthenticationsHandler')
const MenusHandler = require('./handlers/MenusHandler')
const Ordershandler = require('./handlers/OrdersHandler')

const routes = (app, container, middleware) => {
  const usersHandler = new UsersHandler(container)
  const authenticationsHandler = new AuthenticationsHandler(container)
  const menusHandler = new MenusHandler(container)
  const ordersHandler = new Ordershandler(container)

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

  // Order
  app.post('/orders', middleware.checkAuth, ordersHandler.postOrderHandler)
  app.get('/orders/:id', middleware.checkAuth, ordersHandler.getOrderHandler)
  app.get('/orders', middleware.checkAuth, ordersHandler.getAllOrderHandler)
  app.put('/orders/:id', middleware.checkAuth, ordersHandler.putOrderHandler)
  app.put('/orders/:id/status', middleware.checkAuth, ordersHandler.putOrderStatusHandler)
}

module.exports = routes
