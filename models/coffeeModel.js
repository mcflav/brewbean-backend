const mongoose = require('mongoose');
const Joi = require('joi');

const coffeeSchema = mongoose.Schema({
    coffee: {
        type: Array,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    creamer: {
        type: Array,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    topping: {
        type: Array,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    syrup: {
        type: Array,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    sweetener: {
        type: Array,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true
    }
});

const Coffee = mongoose.model('Coffee', coffeeSchema);

function validateCoffee(coffee) {
    const schema = {
        coffee: Joi.array().min(3).max(255).required(),
        creamer: Joi.array().min(3).max(255).required(),
        topping: Joi.array().min(3).max(255).required(),
        syrup: Joi.array().min(3).max(255).required(),
        sweetener: Joi.array().min(3).max(255).required(),
        price: Joi.number().required()
    };
        return Joi.validate(coffee, schema);
}

exports.Coffee = Coffee;
exports.validate = validateCoffee;