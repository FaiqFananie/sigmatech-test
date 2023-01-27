class GetAllMenuUseCase {
  constructor ({ menuRepository }) {
    this._menuRepository = menuRepository
  }

  async execute () {
    return this._menuRepository.getMenus()
  }
}

module.exports = GetAllMenuUseCase
