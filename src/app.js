const createServer = require('./Infrastructures/http/createServer')

const server = createServer()

server.listen(process.env.PORT)
console.log(`server start at ${process.env.PORT}`)
