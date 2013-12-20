var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({

    email: {
        type: String,
        trim: true
    },

    password: {
        type: String,
        trim: true
    },

    type: {
        type: String,
        trim: true
    },

    profile: {
        type: Schema.Types.ObjectId
    },

    provider: {
        type: String,
        trim: true
    },

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    },

    lastLogin: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', User);