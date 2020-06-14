const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    avatar: { type: String },
    pseudoName : {type: String, required: true},
    sexe: { type: String, enum: ['male', 'female']},
    password: { type: String, required: true}
});


module.exports = mongoose.model('User', userSchema);