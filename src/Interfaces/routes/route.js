const routes = (app) => {
  app.get('/', (_, res) => {
    res.json('hello world')
  })
}

module.exports = routes
