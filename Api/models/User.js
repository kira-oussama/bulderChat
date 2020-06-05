const mongoose = require('mongoose');
const validate = require('mongoose-validator');


var pseudoNameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
      }),
];

var passwordValidator = [
    validate({
        validator: 'isLength',
        arguments: [8, 100],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
      }),
];

const userSchema = new mongoose.Schema({
    avatar: { type: String },
    pseudoName : {type: String, required: true, validate: pseudoNameValidator},
    sexe: { type: String, enum: ['male', 'female'], required: true},
    password: { type: String, required: true, validate: passwordValidator }
});


module.exports = mongoose.model('User', userSchema);