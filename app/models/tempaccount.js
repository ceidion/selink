var mongoose = require('mongoose');
var metadata = require('./metadata');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var TempAccount = new Schema({
    // Email
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: validate('isEmail')
    },
    // Password
    password: {
        type: String,
        trim: true,
        required: true,
        validate: validate('len', 8, 30)
    },
    // Account Type
    type: {
        type: String,
        trim: true,
        required: true,
        default: 'engineer',
        enum: metadata.userType_option
    },
    // Create Date
    createDate: {
        type: Date,
        default: Date.now,
        expires: 60 * 60
    }
});

mongoose.model('TempAccount', TempAccount);