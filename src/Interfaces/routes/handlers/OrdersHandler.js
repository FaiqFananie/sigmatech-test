const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const AddOrderUseCase = require('../../../Applications/use_case/AddOrderUseCase')
const GetOrderUseCase = require('../../../Applications/use_case/GetOrderUseCase')
const GetAllOrderUseCase = require('../../../Applications/use_case/GetAllOrderUseCase')
const EditOrderUseCase = require('../../../Applications/use_case/EditOrderUseCase')
const EditStatusOrderUseCase = require('../../../Applications/use_case/EditStatusOrderUseCase')
const DeleteOrderUseCase = require('../../../Applications/use_case/DeleteOrderUseCase')

class Ordershandler {
  constructor (container) {
    this._container = container

    this.postOrderHandler = this.postOrderHandler.bind(this)
    this.getOrderHandler = this.getOrderHandler.bind(this)
    this.getAllOrderHandler = this.getAllOrderHandler.bind(this)
    this.putOrderHandler = this.putOrderHandler.bind(this)
    this.putOrderStatusHandler = this.putOrderStatusHandler.bind(this)
    this.deleteOrderHandler = this.deleteOrderHandler.bind(this)
  }

  async postOrderHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const addOrderUseCase = this._container.getInstance(AddOrderUseCase.name)
      const id = await addOrderUseCase.execute({ createdBy: res.locals.user.id, ...req.body })

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

  async getOrderHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const getOrderUseCase = this._container.getInstance(GetOrderUseCase.name)
      const { id } = req.params

      const result = await getOrderUseCase.execute(id, res.locals.user.id)

      return res.status(200).json({
        status: 'success',
        data: result
      })
    } catch (err) {
      next(err)
    }
  }

  async getAllOrderHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const getAllOrderUseCase = this._container.getInstance(GetAllOrderUseCase.name)
      const result = await getAllOrderUseCase.execute()

      return res.status(200).json({
        status: 'success',
        data: result
      })
    } catch (err) {
      next(err)
    }
  }

  async putOrderHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const { id } = req.params
      const editOrderUseCase = this._container.getInstance(EditOrderUseCase.name)
      await editOrderUseCase.execute(id, req.body)

      return res.status(200).json({
        status: 'success',
        message: 'Order berhasil diperbarui'
      })
    } catch (err) {
      next(err)
    }
  }

  async putOrderStatusHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const { id } = req.params
      const editStatusOrderUseCase = this._container.getInstance(EditStatusOrderUseCase.name)
      await editStatusOrderUseCase.execute(id, req.body)

      return res.status(200).json({
        status: 'success',
        message: 'Order berhasil diperbarui'
      })
    } catch (err) {
      next(err)
    }
  }

  async deleteOrderHandler (req, res, next) {
    try {
      if (res.locals.user.role !== 'pelayan' && res.locals.user.role !== 'kasir') {
        throw new AuthorizationError('Anda tidak punya akses untuk aksi ini')
      }

      const { id } = req.params
      const deleteOrderUseCase = this._container.getInstance(DeleteOrderUseCase.name)
      await deleteOrderUseCase.execute(id)

      return res.status(200).json({
        status: 'success',
        message: 'Order berhasil dihapus'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = Ordershandler
