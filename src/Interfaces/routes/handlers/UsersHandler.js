const AddUserUseCase = require('../../../Applications/use_case/AddUserUseCase')

class UsersHandler {
  constructor (container) {
    this._container = container

    this.postUserHandler = this.postUserHandler.bind(this)
  }

  async postUserHandler (req, res, next) {
    try {
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name)
      const id = await addUserUseCase.execute(req.body)

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

module.exports = UsersHandler
