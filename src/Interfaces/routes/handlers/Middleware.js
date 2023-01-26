const CheckAuthenticationUseCase = require('../../../Applications/use_case/CheckAuthenticationUseCase')
const ClientError = require('../../../Commons/exceptions/ClientError')
const DomainErrorTranslator = require('../../../Commons/exceptions/DomainErrorTranslator')
const AccessToken = require('../../../Domains/authentications/entities/AccessToken')

class Middleware {
  constructor (logger, container) {
    this._logger = logger
    this._container = container

    this.responseError = this.responseError.bind(this)
    this.checkAuth = this.checkAuth.bind(this)
  }

  async responseError (error, req, res, next) {
    const translatedError = DomainErrorTranslator.translate(error)

    if (translatedError instanceof ClientError) {
      this._logger.error(`{ "url": "${req.originalUrl}", "code": ${translatedError.statusCode}, "method": "${req.method}", "ip": "${req.ip}", "message": "${translatedError.message}"}`)
      res.status(translatedError.statusCode)
      res.json({
        status: 'fail',
        message: translatedError.message
      })
      return res
    }

    this._logger.error(`{ "url": "${req.originalUrl}", "code": 500, "method": "${req.method}", "ip": "${req.ip}", "message": "terjadi kegagalan pada server kami"}`)
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
      await checkAuthentication.execute(token)
      next()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Middleware
