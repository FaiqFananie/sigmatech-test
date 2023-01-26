const MenuRepository = require('../../Domains/menus/MenuRepository')

class MenuRepositoryPostgres extends MenuRepository {
  constructor (model, idGenerator) {
    super()
    this._menu = model
    this._idGenerator = idGenerator
  }

  async addMenu (menuPayload) {
    const { name, type, ready, price } = menuPayload
    const id = `menu-${this._idGenerator()}`

    const result = await this._menu.create({
      id,
      name,
      type,
      ready,
      price
    })

    return result.id
  }
}

module.exports = MenuRepositoryPostgres
