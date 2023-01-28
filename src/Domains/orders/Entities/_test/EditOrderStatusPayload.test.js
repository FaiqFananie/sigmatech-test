const EditOrderStatusPayload = require('../EditOrderStatusPayload')

describe('EditOrderPayload entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action & Assert
    expect(() => new EditOrderStatusPayload(payload)).toThrowError('EDIT_ORDER_STATUS_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      isPaid: {}
    }

    // Action & Assert
    expect(() => new EditOrderStatusPayload(payload)).toThrowError('EDIT_ORDER_STATUS_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create OrderPayload entities correctly', () => {
    // Arrange
    const payload = {
      isPaid: true
    }

    // Action
    const editOrderPayload = new EditOrderStatusPayload(payload)

    // Assert
    expect(editOrderPayload).toBeInstanceOf(EditOrderStatusPayload)
    expect(editOrderPayload.isPaid).toEqual(payload.isPaid)
  })
})
