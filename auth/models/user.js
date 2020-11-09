const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    createdOn:{type: Date , default: Date.now}
});

module.exports = mongoose.model('User',userSchema);