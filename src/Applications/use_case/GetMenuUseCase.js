class GetMenuUseCase {
  constructor ({ menuRepository }) {
    this._menuRepository = menuRepository
  }

  async execute (id) {
    return this._menuRepository.getMenuById(id)
  }
}

module.exports = GetMenuUseCase
