/* istanbul ignore file */

const winston = require('winston')
require('winston-daily-rotate-file')

function formatParams (info) {
  const {
    timestamp, level, message, ...args
  } = info
  const ts = timestamp.slice(0, 23)
  return `{ "date": "${ts}", "level": "${level}", "data": ${message} ${Object.keys(args).length
    ? JSON.stringify(args, '', '')
    : ''} }`
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.printf(formatParams)
)

const errorTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: './logs/Error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  handleExceptions: true,
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '30d'
})

const options = {
  file: {
    level: 'info',
    filename: 'logs/your-app.log',
    handleExceptions: true,
    json: true,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    errorTransport,
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
})

logger.stream = {
  write (message) {
    logger.info(message)
  }
}

module.exports = logger
