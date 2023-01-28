/* istanbul ignore file */
const { OrderMenu } = require('../../models/menu_order')

const OrderMenusTableTestHelper = {
  async cleanTable () {
    await OrderMenu.destroy({ truncate: true, force: true })
  }
}

module.exports = OrderMenusTableTestHelper
