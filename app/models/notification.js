var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Notification = new Schema({

    // notification owner
    _owner: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // notification sender
    _from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // notification type
    type: {
        type: String,
        trim: true,
        required: true
    },

    // notification target
    target: {
        type: Schema.Types.ObjectId
    },

    // notification confirmed
    confirmed: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // result of user reaction
    result: {
        type: String,
        trim: true
    },

    // Logical Delete flag
    logicDelete: {
        type: Boolean,
        default: false
    },

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Notification', Notification);