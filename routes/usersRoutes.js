const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User, validateUsers} = require('../models/orderModel');
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req,res) => {
    const users = await User.find().sort('firstname');
    res.send(users);
});

router.get('/:id', validateObjectId, async (req,res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('This user could not be found');
    res.send(user);
});

router.post('/', async (req,res) => {
    const {error} = validateUsers(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = new User({email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname, password: req.body.password, isAdmin: req.body.isAdmin});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'firstname']));
    res.send(user);
});

router.put('/', async (req,res) => {
    const {error} = validateUsers(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) return res.status(404).send('This user could not be found');
    res.send(user);
});

router.delete('/:id', async (req,res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('This user could not be found');
    res.send(user);    
});

module.exports = router;
