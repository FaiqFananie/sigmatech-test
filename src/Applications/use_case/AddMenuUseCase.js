const MenuPayload = require('../../Domains/menus/entities/MenuPayload')

class MenuUserUseCase {
  constructor ({ menuRepository }) {
    this._menuRepository = menuRepository
  }

  async execute (useCasePayload) {
    const menuPayload = new MenuPayload(useCasePayload)
    return this._menuRepository.addMenu(menuPayload)
  }
}

module.exports = MenuUserUseCase
