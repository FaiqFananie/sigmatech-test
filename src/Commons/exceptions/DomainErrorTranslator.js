const AuthenticationError = require('./AuthenticationError')
const InvariantError = require('./InvariantError')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'MENU_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dibutuhkan belum cukup'),
  'MENU_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data tidak sesuai'),
  'CHECK_AUTHENTICATION_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN': new AuthenticationError('Authentication Error'),
  'CHECK_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new AuthenticationError('Authentication Error'),
  'ACCESS_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY': new AuthenticationError('Authentication Error'),
  'ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dibutuhkan belum cukup'),
  'ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data tidak sesuai'),
  'EDIT_ORDER_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dibutuhkan belum cukup'),
  'EDIT_ORDER_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data tidak sesuai'),
  'EDIT_ORDER_STATUS_PAYLOAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('properti yang dibutuhkan belum cukup'),
  'EDIT_ORDER_STATUS_PAYLOAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data tidak sesuai')

}

module.exports = DomainErrorTranslator
