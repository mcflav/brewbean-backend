const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Access Denied. No token provided.' });
    
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex) {
        res.status(400).send({auth: false, message: 'Failed to authenticate token.'});
    }
}