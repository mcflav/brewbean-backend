const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authentication = require('../routes/authentication');
const orders = require('../routes/ordersRoutes');
const coffees = require('../routes/coffeeRoutes');
const users = require('../routes/usersRoutes');
const error = require('../middleware/error');

module.exports = function(app){
    app.use(express.json());
    app.use(cors());
    app.use('/api/v1/users', users);
    app.use('/api/v1/coffee', coffees);
    app.use('/api/v1/orders', orders);
    app.use('/api/v1/authentication', authentication);
    app.use(error);
};

