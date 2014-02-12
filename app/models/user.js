var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = require('./event');

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
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },

    provider: {
        type: String,
        trim: true
    },

    events: [Event],

    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    messages: [Schema.Types.ObjectId],

    sents:[Schema.Types.ObjectId],

    drafts:[Schema.Types.ObjectId],

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