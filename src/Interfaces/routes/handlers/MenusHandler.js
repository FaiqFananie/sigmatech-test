const AddMenuUseCase = require('../../../Applications/use_case/AddMenuUseCase')
const DeleteMenuUseCase = require('../../../Applications/use_case/DeleteMenuUseCase')
const EditMenuUseCase = require('../../../Applications/use_case/EditMenuUseCase')
const GetAllMenuUseCase = require('../../../Applications/use_case/GetAllMenuUseCase')
const GetMenuUseCase = require('../../../Applications/use_case/GetMenuUseCase')

class MenusHandler {
  constructor (container) {
    this._container = container

    this.postMenuHandler = this.postMenuHandler.bind(this)
    this.getMenuHandler = this.getMenuHandler.bind(this)
    this.getAllMenuHandler = this.getAllMenuHandler.bind(this)
    this.editMenuHandler = this.editMenuHandler.bind(this)
    this.deleteMenuHandler = this.deleteMenuHandler.bind(this)
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

  async getMenuHandler (req, res, next) {
    try {
      const getMenuUseCase = this._container.getInstance(GetMenuUseCase.name)
      const { id } = req.params

      const result = await getMenuUseCase.execute(id)

      return res.status(200).json({
        status: 'success',
        data: result
      })
    } catch (err) {
      next(err)
    }
  }

  async getAllMenuHandler (req, res) {
    const getAllMenuUseCase = this._container.getInstance(GetAllMenuUseCase.name)
    const result = await getAllMenuUseCase.execute()

    return res.status(200).json({
      status: 'success',
      data: result
    })
  }

  async editMenuHandler (req, res, next) {
    try {
      const { id } = req.params
      const editMenuUseCase = this._container.getInstance(EditMenuUseCase.name)

      await editMenuUseCase.execute(id, req.body)

      return res.status(200).json({
        status: 'success',
        message: 'Menu berhasil diperbarui'
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteMenuHandler (req, res, next) {
    try {
      const { id } = req.params
      const deleteMenuUseCase = this._container.getInstance(DeleteMenuUseCase.name)

      await deleteMenuUseCase.execute(id)

      return res.status(200).json({
        status: 'success',
        message: 'Menu berhasil dihapus'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = MenusHandler
