const OrderPayload = require('../OrderPayload')

describe('OrderPayload entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      tableNumber: 1
    }

    // Action & Assert
    expect(() => new OrderPayload(payload)).toThrowError('ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      isPaid: false,
      menus: {}
    }

    // Action & Assert
    expect(() => new OrderPayload(payload)).toThrowError('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: '1',
      isPaid: false
    }

    // Action & Assert
    expect(() => new OrderPayload(payload)).toThrowError('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      isPaid: false,
      menus: [12, 23]
    }

    // Action & Assert
    expect(() => new OrderPayload(payload)).toThrowError('ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create OrderPayload entities correctly', () => {
    // Arrange
    const payload = {
      tableNumber: 1,
      isPaid: false
    }

    // Action
    const orderPayload = new OrderPayload(payload)

    // Assert
    expect(orderPayload).toBeInstanceOf(OrderPayload)
    expect(orderPayload.tableNumber).toEqual(payload.tableNumber)
    expect(orderPayload.isPaid).toEqual(payload.isPaid)
    expect(orderPayload.menus).toEqual([])
  })
})
