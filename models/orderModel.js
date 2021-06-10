const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
   email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
   },
   firstname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
   },
   lastname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
   },   
   password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
   },   
   isAdmin: {
        type: Boolean,
        default: false
   }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    return token;
};

const User = mongoose.model('User', userSchema);




const orderSchema = mongoose.Schema({
    coffee: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
   },
   creamer: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
   },
   topping: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
   },
   syrup: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
   },
   sweetener: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
   },
   price: {
        type: Number,
        required: true,
   },
   quantity: {
        type: Number,
        required: true
   },
   subTotal: {
        type: Number,
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   }
});

const Order = mongoose.model('Order', orderSchema);

function validateUsers(users) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        firstname: Joi.string().min(3).max(255).required(),
        lastname: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    };
        return Joi.validate(users, schema);
}


function validateOrders(orders) {
    const schema = {
        coffee: Joi.string().min(5).max(255).required(),
        creamer: Joi.string().min(5).max(255).required(),
        topping: Joi.string().min(5).max(255).required(),
        syrup: Joi.string().min(5).max(255).required(),
        sweetener: Joi.string().min(5).max(255).required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        user: Joi.objectid().required()
    };
        return Joi.validate(orders, schema);
}



exports.validateOrders = validateOrders;
exports.Order = Order;
exports.User = User;
exports.validateUsers = validateUsers;

