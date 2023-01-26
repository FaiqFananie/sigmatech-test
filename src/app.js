const createServer = require('./Infrastructures/http/createServer')
const container = require('../src/Infrastructures/container')

const server = createServer(container)

server.listen(process.env.PORT)
console.log(`server start at ${process.env.PORT}`)
