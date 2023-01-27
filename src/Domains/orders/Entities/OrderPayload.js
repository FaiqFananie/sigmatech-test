class OrderPayload {
  constructor ({ tableNumber, isPaid, createdBy, menus = [] }) {
    this._verifyPayload({ tableNumber, isPaid, createdBy, menus })

    this.tableNumber = tableNumber
    this.isPaid = isPaid
    this.createdBy = createdBy
    this.menus = menus
  }

  _verifyPayload (payload) {
    const { tableNumber, isPaid, createdBy, menus } = payload

    if (!tableNumber || isPaid === undefined || isPaid === null || !createdBy) {
      throw new Error('ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof tableNumber !== 'number' || typeof isPaid !== 'boolean' || typeof createdBy !== 'string') {
      throw new Error('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

    if (Array.isArray(menus) && menus.length > 0) {
      for (const menu of menus) {
        if (typeof menu !== 'string') {
          throw new Error('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
        }
      }
    } else if (!Array.isArray(menus)) {
      throw new Error('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = OrderPayload
