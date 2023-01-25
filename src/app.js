const createServer = require('./Infrastructures/http/createServer')
const container = require('../../Infrastructures/container')

const server = createServer(container)

server.listen(process.env.PORT)
console.log(`server start at ${process.env.PORT}`)
