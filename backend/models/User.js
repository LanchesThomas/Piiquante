const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Veuillez entrer votre adresse email'],
        unique: true,
    },
    password: { type: String, required: true },
});

// add unique validator to users in database
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
