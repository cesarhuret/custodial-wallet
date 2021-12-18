const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    address: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true,
    },
    tokenContracts: [{
      type: String,
      required: false
    }]

}, { collection: 'users' }

);

module.exports = mongoose.model('User', UserSchema);