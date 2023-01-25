const ClientError = require('../../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../../Commons/exceptions/DomainErrorTranslator')

class Middleware {
  constructor (logger) {
    this._logger = logger

    this.responseError = this.responseError.bind(this)
  }

  responseError (error, req, res, next) {
    if (error instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(error)

      if (translatedError instanceof ClientError) {
        this._logger.error(`{ "url": "${req.originalUrl}", "code": ${translatedError.statusCode}, "method": "${req.method}", "ip": "${req.ip}", "message": "${translatedError.message}"}`)
        res.status(translatedError.statusCode)
        res.json({
          status: 'fail',
          message: translatedError.message
        })
      }

      if (!translatedError.isServer) {
        return res
      } else {
        this._logger.error(`{ "url": "${req.originalUrl}", "code": 500, "method": "${req.method}", "ip": "${req.ip}", "message": "terjadi kegagalan pada server kami"}`)
        res.status(500)
        res.json({
          status: 'fail',
          message: 'terjadi kegagalan pada server kami'
        })
        return res
      }
    }
  }
}

module.exports = Middleware
