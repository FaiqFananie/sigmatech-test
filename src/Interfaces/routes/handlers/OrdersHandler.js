const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddOrderUseCase = require('../../../Applications/use_case/AddOrderUseCase')

class Ordershandler {
  constructor (container) {
    this._container = container

    this.postOrderHandler = this.postOrderHandler.bind(this)
  }

  async postOrderHandler (req, res, next) {
    try {
      console.log(res.locals.user.role)
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const addOrderUseCase = this._container.getInstance(AddOrderUseCase.name)
      const id = await addOrderUseCase.execute(req.body)

      return res.status(201).json({
        status: 'success',
        data: {
          id
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Ordershandler
