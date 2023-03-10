const RegisterUser = require('../RegisterUser')

describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
      role: 'pelayan'
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc',
      role: 'pelayan'
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload = {
      username: 'faiqfananiefasadjascldnvldnpasnflvnlczncpadnpsancdspvnpfsnfvpsnvp',
      fullname: 'Faiq Fananie',
      password: 'abc',
      role: 'pelayan'
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR')
  })

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'fa iqfananie',
      fullname: 'faiqfananie',
      password: 'abc',
      role: 'pelayan'
    }

    // Action and Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
  })

  it('should make role to lowercase', () => {
    // Arrange
    const payload = {
      username: 'faiqfananie',
      fullname: 'Faiq Fananie',
      password: 'abc',
      role: 'PELAYAN'
    }

    // Action
    const { username, fullname, password, role } = new RegisterUser(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
    expect(role).toEqual(payload.role.toLowerCase())
  })

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'faiqfananie',
      fullname: 'Faiq Fananie',
      password: 'abc',
      role: 'pelayan'
    }

    // Action
    const { username, fullname, password, role } = new RegisterUser(payload)

    // Assert
    expect(username).toEqual(payload.username)
    expect(fullname).toEqual(payload.fullname)
    expect(password).toEqual(payload.password)
    expect(role).toEqual(payload.role)
  })
})
