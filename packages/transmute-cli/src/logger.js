const winston = require('winston');
const path = require('path');
const homedir = require('os').homedir();
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, colorize, json, printf } = format;

const logger = createLogger({
  format: format.combine(
    format.label({ label: 'console' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json()
  ),

  transports: [
    new winston.transports.File({
      filename: path.join(homedir, '.transmute/transmute-cli.combined.log.json')
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        label({ label: 'console' }),
        timestamp(),
        printf(info => {
          return `${info.timestamp} [${info.label}] ${info.level}: ${
            info.message
          }`;
        })
      )
    })
  );
}

module.exports = logger;
