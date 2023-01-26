const AddMenuUseCase = require('../../../Applications/use_case/AddMenuUseCase')

class MenusHandler {
  constructor (container) {
    this._container = container

    this.postMenuHandler = this.postMenuHandler.bind(this)
  }

  async postMenuHandler (req, res, next) {
    try {
      const addMenuUseCase = this._container.getInstance(AddMenuUseCase.name)
      const id = await addMenuUseCase.execute(req.body)

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

module.exports = MenusHandler
