const mongoose = require('mongoose');

const User = mongoose.Schema({
  email: String,
  password: String
}, {timestamps: true});

module.exports = mongoose.model('users', User);