const winston = require('../../logger')
const WinstonLogger = require('../WinstonLogger')

describe('WinstonLogger', () => {
  describe('Print Log', () => {
    it('should print log correctly', () => {
      // Arrange
      const spyWinston = jest.spyOn(winston, 'error')
      const winstonLogger = new WinstonLogger(winston)

      // Action
      const detail = winstonLogger.printLog('/test', 400, 'GET', '127.0.0.1', 'Error')

      // Assert
      expect(detail).toEqual('{ "url": "/test", "code": 400, "method": "GET", "ip": "127.0.0.1", "message": "Error"}')
      expect(spyWinston).toBeCalled()
    })
  })

  it('should print log with no parameter correctly', () => {
    // Arrange
    const winstonLogger = new WinstonLogger(winston)

    // Action
    const detail = winstonLogger.printLog()

    // Assert
    expect(detail).toEqual('{ "url": "", "code": 0, "method": "", "ip": "", "message": ""}')
  })
})
