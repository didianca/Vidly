require('express-async-errors');
const logger = require('../middleware/logger');


module.exports = function(){///Handling Exceptions && Rejections
process.on('uncaughtException',(ex)=>{
    console.log('WE GOT AN UNCAUGHT EXCEPTION');
    logger.error(ex.message, ex);
});

process.on('unhandledRejection',(ex)=>{
    throw ex
});


//throw new Error ('Weird error... O_O');
//const p = Promise.reject(new Error('Unhandled Rejection.Check your promises ... :('));
//p.then(()=>console.log('Done'));

};
