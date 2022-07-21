//mongoose user scheme
const mongoose = require('mongoose');

// create User Schema
const User = mongoose.Schema({
  email: String,
  password: String
}, {timestamps: true});

module.exports = mongoose.model('users', User);