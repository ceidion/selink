var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Message = new Schema({

    // message owner (recipient)
    _recipient: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],

    // message sender
    _from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // message subject
    subject: {
        type: String,
        trim: true,
        required: true
    },

    // message content
    content: {
        type: String,
        trim: true,
        required: true
    },

    // message reference
    reference: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },

    // message opened
    opened: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Logical Delete flag
    logicDelete: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Message', Message);