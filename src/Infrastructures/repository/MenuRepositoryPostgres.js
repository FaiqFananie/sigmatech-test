const MenuRepository = require('../../Domains/menus/MenuRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const InvariantError = require('../../Commons/exceptions/InvariantError')

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

  async editMenu (id, menuPayload) {
    const { name, type, ready, price } = menuPayload

    const menu = await this._menu.update({
      name,
      type,
      ready,
      price
    }, { where: { id } })

    if (menu[0] === 0) {
      throw new NotFoundError('Menu gagal diperbarui, Id tidak ditemukan')
    }
  }

  async verifyAvailableMenu (id, option = '') {
    const menu = await this._menu.findByPk(id)

    if (!menu) {
      throw new NotFoundError('Menu tidak ditemukan')
    }

    if (menu.ready === false && option !== 'delete') {
      throw new InvariantError('Menu ini sedang tidak tersedia')
    }

    if (menu.ready === true && option === 'delete') {
      throw new InvariantError('Menu ini masih tersedia')
    }
  }

  async getMenuById (id) {
    const menu = await this._menu.findByPk(id)

    if (!menu) {
      throw new NotFoundError('Menu tidak ditemukan')
    }

    return menu
  }

  async getMenus () {
    const menus = await this._menu.findAll()

    return menus
  }

  async deleteMenu (id) {
    const menu = await this._menu.destroy({ where: { id } })

    if (menu === 0) {
      throw new NotFoundError('Menu gagal dihapus, Id tidak ditemukan')
    }
  }
}

module.exports = MenuRepositoryPostgres
