const express = require('express');
const mongoose = require('mongoose');
const { Order, User, validateOrders } = require('../models/orderModel');
const { Coffee } = require('../models/coffeeModel');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//const error = require('../middleware/error');
const router = express.Router();

router.get('/getOrder', async (req,res) => {
    
    const user = await User.find();
    const userOrder = req.body.user;
    
    let orderFound = false;
                
    for (i = 0; i < user.length; i++) {
       if (user[i]._id == userOrder) {
           orderFound = true;
       }
    }
    
    if (orderFound === false) {
        return res.status(404).send('An order could not be found for this user');
    } else {
      const orders = await Order.find({user: userOrder});
      res.send(orders);
    }
});

router.get('/', async (req,res) => {
    const orders = await Order.find().sort('coffee');
    res.send(orders);
});


router.get('/:id', validateObjectId, async (req,res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send('This order could not be found');
    
    res.send(order);
});

router.post('/', auth, async (req,res) => {
    const {error} = validateOrders(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let coffee = await Coffee.find({coffee: req.body.coffee});
    
    if (coffee.length != 0) {
        if (req.body.quantity <= 0) return res.status(400).send('Please enter a quantity greater than zero.');
    
        let total = req.body.price * req.body.quantity;
        
        async function createOrder(coffee, creamer, topping, syrup, sweetener, price, quantity, subTotal, user) {
            const order = new Order ({
                coffee,
                creamer,
                topping,
                syrup,
                sweetener,
                price,
                quantity,
                subTotal,
                user
            });
            
            const result = await order.save();
            res.send(result);
        }
        
        const subTotal = req.body.price * req.body.quantity;
                
        createOrder(req.body.coffee, req.body.creamer, req.body.topping, req.body.syrup, req.body.sweetener, req.body.price, req.body.quantity, subTotal, req.body.user);
    } else {
        res.status(404).send('This coffee could not be found');
    }
});

router.put('/:id', auth, async (req,res) => {
    const { error } = validateOrders(req.body.coffee);
    if (error) return res.status(400).send(errors.details[0].message);
    
    const coffee = await Order.findByIdAndUpdate(req.params.id, req.body);
    if(!coffee) return res.status(404).send('This order could not be found.');
    
    res.send(coffee);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req,res) => {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) return res.status(404).send('This order could not be found.');
    res.send(order);
})

module.exports = router;