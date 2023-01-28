const EditOrderPayload = require('../EditOrderPayload')

describe('EditOrderPayload entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {}

    // Action & Assert
    expect(() => new EditOrderPayload(payload)).toThrowError('EDIT_ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      menus: {}
    }

    // Action & Assert
    expect(() => new EditOrderPayload(payload)).toThrowError('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: '1'
    }

    // Action & Assert
    expect(() => new EditOrderPayload(payload)).toThrowError('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      menus: [12, 23]
    }

    // Action & Assert
    expect(() => new EditOrderPayload(payload)).toThrowError('EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create OrderPayload entities correctly', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      menus: ['menu-123', 'menu-124']
    }

    // Action
    const editOrderPayload = new EditOrderPayload(payload)

    // Assert
    expect(editOrderPayload).toBeInstanceOf(EditOrderPayload)
    expect(editOrderPayload.tableNumber).toEqual(payload.tableNumber)
    expect(editOrderPayload.menus).toEqual(['menu-123', 'menu-124'])
  })
})
