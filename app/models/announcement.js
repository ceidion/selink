var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Announcement = new Schema({

    // Announcement owner
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // Title
    title: {
        type: String,
        trim: true,
    },

    // Content
    content: {
        type: String,
        trim: true,
    },

    // Expired Date
    expiredDate: {
        type: Date
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

mongoose.model('Announcement', Announcement);