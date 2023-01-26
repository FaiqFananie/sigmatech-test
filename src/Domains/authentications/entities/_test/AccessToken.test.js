const AccessToken = require('../AccessToken')

describe('Access Token entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const headers = {}

    // Action & Assert
    expect(() => new AccessToken(headers)).toThrowError('ACCESS_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should create Access Token entities correctly', () => {
    // Arrange
    const headers = {
      authorization: 'bearer ALJNFLNDOISBOKEFKS'
    }

    // Action
    const accessToken = new AccessToken(headers)

    // Assert
    expect(accessToken).toBeInstanceOf(AccessToken)
    expect(accessToken.token).toEqual(headers.authorization.split(' ')[1])
  })
})
