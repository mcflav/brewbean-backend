const express = require('express');
const {Coffee, validate} = require('../models/coffeeModel');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
   const coffee = await Coffee.find().sort('coffee');
   res.send(coffee);
});

router.get('/:id', auth, validateObjectId, async (req, res) => {
    const coffee = await Coffee.findById(req.params.id);
    res.send(coffee);
});

router.post('/', auth, async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let coffee = new Coffee({coffee: req.body.coffee, creamer: req.body.creamer, topping: req.body.topping, syrup: req.body.syrup, sweetener: req.body.sweetener,  price: req.body.price});
    coffee = await coffee.save();
    res.send(coffee);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const coffee = await Coffee.findByIdAndUpdate(req.params.id, req.body);
    res.send(coffee);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const coffee = await Coffee.findByIdAndRemove(req.params.id);
    res.send(coffee);
});

module.exports = router;