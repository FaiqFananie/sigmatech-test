class DeleteMenuUseCase {
  constructor ({ menuRepository }) {
    this._menuRepository = menuRepository
  }

  async execute (id) {
    await this._menuRepository.verifyAvailableMenu(id, 'delete')
    return this._menuRepository.deleteMenu(id)
  }
}

module.exports = DeleteMenuUseCase
