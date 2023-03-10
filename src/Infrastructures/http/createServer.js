const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const winston = require('../logger')
const routes = require('../../Interfaces/routes/route')
const Middleware = require('../../Interfaces/routes/handlers/Middleware')

const createServer = (container) => {
  const middleware = new Middleware(container)

  const app = express()
  app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
  app.use(cors())
  app.use(express.json({ limit: '5mb', type: 'application/json' }))
  app.use(express.urlencoded({ limit: '5mb', extended: true }))
  app.use(cookieParser())
  app.use(morgan(
    '{ "remote_addr": ":remote-addr", ' +
    '"remote_user": ":remote-user", ' +
    '"method": ":method", "url": ":url", ' +
    '"http_version": ":http-version", ' +
    '"status": ":status", ' +
    '"user_agent": ":user-agent", ' +
    '"response_time": ":response-time ms" }',
    { stream: winston.stream }))

  routes(app, container, middleware)
  app.use(middleware.responseError)

  return app
}

module.exports = createServer
