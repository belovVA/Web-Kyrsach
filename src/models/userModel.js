const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    lastName: String,
    firstName: String,
    middleName: String,
    phone: { type: String, unique: true },
    birthday: Date,
    password: String,
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
