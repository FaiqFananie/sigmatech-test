const MenuPayload = require('../MenuPayload')

describe('MenuPayload entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      name: 'nasi goreng',
      type: 'makanan',
      ready: true
    }

    // Action & Assert
    expect(() => new MenuPayload(payload)).toThrowError('MENU_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 'nasi goreng',
      type: true,
      ready: 'makanan',
      price: 200000
    }

    // Action & Assert
    expect(() => new MenuPayload(payload)).toThrowError('MENU_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create UserLogin entities correctly', () => {
    // Arrange
    const payload = {
      name: 'nasi goreng',
      type: 'makanan',
      ready: true,
      price: 200000
    }

    // Action
    const menuPayload = new MenuPayload(payload)

    // Assert
    expect(menuPayload).toBeInstanceOf(MenuPayload)
    expect(menuPayload.name).toEqual(payload.name)
    expect(menuPayload.type).toEqual(payload.type)
    expect(menuPayload.ready).toEqual(payload.ready)
    expect(menuPayload.price).toEqual(payload.price)
  })
})
