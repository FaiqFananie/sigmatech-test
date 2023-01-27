const MenuPayload = require('../../Domains/menus/entities/MenuPayload')

class EditMenuUseCase {
  constructor ({ menuRepository }) {
    this._menuRepository = menuRepository
  }

  async execute (id, useCasePayload) {
    const menuPayload = new MenuPayload(useCasePayload)
    return this._menuRepository.editMenu(id, menuPayload)
  }
}

module.exports = EditMenuUseCase
