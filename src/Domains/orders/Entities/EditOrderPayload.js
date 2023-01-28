class EditOrderPayload {
  constructor ({ tableNumber, menus = [] }) {
    this._verifyPayload({ tableNumber, menus })

    this.tableNumber = tableNumber
    this.menus = menus
  }

  _verifyPayload (payload) {
    const { tableNumber, menus } = payload

    if (!tableNumber) {
      throw new Error('EDIT_ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof tableNumber !== 'number') {
      throw new Error('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (Array.isArray(menus) && menus.length > 0) {
      for (const menu of menus) {
        if (typeof menu !== 'string') {
          throw new Error('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
      }
    } else if (!Array.isArray(menus)) {
      throw new Error('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = EditOrderPayload
