class EditOrderStatusPayload {
  constructor ({ isPaid }) {
    this._verifyPayload({ isPaid })

    this.isPaid = isPaid
  }

  _verifyPayload (payload) {
    const { isPaid } = payload

    if (!isPaid) {
      throw new Error('EDIT_ORDER_STATUS_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof isPaid !== 'boolean') {
      throw new Error('EDIT_ORDER_STATUS_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = EditOrderStatusPayload
