const express = require('express');
const app = express();
const winston = require('winston');
const console = new winston.transports.Console();

winston.add(console);

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

//PORT
const port =  process.env.PORT || 3000;
const server = app.listen(port,() =>winston.info( `Listening on port ${port}..`));

module.exports = server;