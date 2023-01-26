const Logger = require('../../Applications/debug/Logger')

class WinstonLogger extends Logger {
  constructor (winston) {
    super()
    this._logger = winston
  }

  printLog (url = '', statusCode = 0, method = '', ip = '', message = '') {
    const detail = `{ "url": "${url}", "code": ${statusCode}, "method": "${method}", "ip": "${ip}", "message": "${message}"}`
    this._logger.error(detail)
    return detail
  }
}

module.exports = WinstonLogger
