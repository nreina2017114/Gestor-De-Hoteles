'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    nickname: String,
    password: String,
    role: String
});

module.exports = mongoose.model('user', userSchema);