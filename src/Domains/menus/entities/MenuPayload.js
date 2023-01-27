class MenuPayload {
  constructor (payload) {
    this._verifyPayload(payload)

    this.name = payload.name
    this.type = payload.type
    this.ready = payload.ready
    this.price = payload.price
  }

  _verifyPayload (payload) {
    const { name, type, ready, price } = payload

    if (!name || !type || ready === undefined || ready === null || !price) {
      throw new Error('MENU_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof name !== 'string' || typeof type !== 'string' || typeof ready !== 'boolean' || typeof price !== 'number') {
      throw new Error('MENU_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = MenuPayload
