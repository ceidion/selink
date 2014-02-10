var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Message = new Schema({

    // sender
    sender: {
        type: Schema.Types.ObjectId
    },

    // recipients
    recipients: [Schema.Types.ObjectId],

    // subject
    subject: {
        type: String,
        trim: true,
        validate: validate('len', 0, 100)
    },

    // message body
    message: {
        type: String,
        trim: true,
    },

    // message attachments
    attachments: [String],

    // Logical Delete flag
    logicDelete: {
        type: Boolean,
        default: false
    },

    // Create Date
    createDate: {
        type: Date,
        default: Date.now
    },

    // Creator
    createUser: {
        type: String,
        trim: true
    },

    // Modify Date
    updateDate: {
        type: Date,
        default: Date.now
    },

    // Modifier
    updateUser: {
        type: String,
        trim: true
    }
});

mongoose.model('Message', Message);