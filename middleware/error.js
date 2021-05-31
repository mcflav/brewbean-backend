const winston = require('winston');

module.exports = function(err,req,res,next) {
    winston.error(err.message, err);
    res.status(400).send('Something failed.');
};