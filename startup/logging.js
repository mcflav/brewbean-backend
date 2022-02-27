const winston = require('winston');
require('express-async-errors');
require('winston-mongodb');

module.exports = function(){
  winston.handleExceptions(
    new winston.transports.Console({colorize: true, prettyPrint: true}),
    new winston.transports.File({filename: 'uncaughtExceptions.log'})
  );
  
  process.on('unhandleRejection', (ex) => {
    throw ex;
  });
  
  winston.add(winston.transports.File, {filename: 'logfile.log'});
  //winston.add(winston.transports.MongoDB, {
  //  db: 'mongodb://localhost/brewbean' ,
  //  level: 'error'
  //});
};