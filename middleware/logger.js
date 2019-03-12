const { createLogger, transports } = require('winston');
require('winston-mongodb');

const logger = createLogger({
    exitOnError: false,//<-- doesn't work. it still ends the process
    transports: [
        new transports.File({ filename: './uncaughtExceptions.log', level: 'info'}),
        new transports.Console(),
        new transports.MongoDB({
            level: 'info',
            db: 'mongodb://localhost/vidly',
            collection:'uncaughtExceptions',
        })
    ]
});

module.exports = logger;