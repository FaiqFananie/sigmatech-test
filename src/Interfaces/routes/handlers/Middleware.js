const winston = require('../../../Infrastructures/logger')
const Logger = require('../../../Applications/debug/Logger')
const CheckAuthenticationUseCase = require('../../../Applications/use_case/CheckAuthenticationUseCase')
const ClientError = require('../../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../../Commons/exceptions/DomainErrorTranslator')
const AccessToken = require('../../../Domains/authentications/entities/AccessToken')

class Middleware {
  constructor (container) {
    this._container = container

    this.responseError = this.responseError.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
  }

  async responseError (error, req, res, next) {
    const translatedError = DomainErrorTranslator.translate(error)

    if (translatedError instanceof ClientError) {
      const logger = this._container.getInstance(Logger.name)
      logger.printLog(req.originalUrl, translatedError.statusCode, req.method, req.ip, translatedError.message)
      res.status(translatedError.statusCode)
      res.json({
        status: 'fail',
        message: translatedError.message
      })
      return res
    }

    console.log(error)
    winston.error(`{ "url": "${req.originalUrl}", "code": 500, "method": "${req.method}", "ip": "${req.ip}", "message": "terjadi kegagalan pada server kami"}`)
    res.status(500)
    res.json({
      status: 'fail',
      message: 'terjadi kegagalan pada server kami'
    })
    return res
  }

  async checkAuth (req, res, next) {
    try {
      const { token } = new AccessToken(req.headers)
      const checkAuthentication = this._container.getInstance(CheckAuthenticationUseCase.name)
      const result = await checkAuthentication.execute(token)

      res.locals.user = result
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Middleware
