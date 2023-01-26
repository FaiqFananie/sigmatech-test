/* istanbul ignore file */
const Menu = require('../../models/menu')

const MenusTableTestHelper = {
  async addMenus ({
    id = 'menu-123', name = 'Nasi Goreng', type = 'makanan', ready = true, price = 20000
  }) {
    const newMenu = await Menu.create({
      id,
      name,
      type,
      ready,
      price
    })

    return newMenu.id
  },

  async findMenusById (id) {
    const menu = await Menu.findOne({ where: { id } })

    return menu
  },

  async cleanTable () {
    await Menu.destroy({ truncate: true, force: true })
  }
}

module.exports = MenusTableTestHelper
