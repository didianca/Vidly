const { createLogger, transports } = require('winston');

const logger = createLogger({
  transports: [
    new transports.File({ filename: './logfile.log', level: 'info' }),
    new transports.Console()
  ]
});

module.exports = (err, req, res, next) => {
  logger.error(err.message,err);
  res.status(500).send('Somethings went wrong...');
};