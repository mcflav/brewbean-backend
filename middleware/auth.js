const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    // const token = req.header('x-auth-token');
    var token = req.headers['x-access-token'];
    if (!token) 
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.get("jwtPrivateKey"), function(err, decoded) {
        if(err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
            req.userId = decoded.id;
            next();
    });
}