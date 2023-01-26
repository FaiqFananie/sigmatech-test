class AccessToken {
  constructor (headers) {
    this._verifyPayload(headers)

    this.token = headers.authorization.split(' ')[1]
  }

  _verifyPayload (headers) {
    if (!headers.authorization) {
      throw new Error('ACCESS_TOKEN.NOT_CONTAIN_NEEDED_PROPERTY')
    }
  }
}

module.exports = AccessToken
