var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Activity = new Schema({

    // activity owner
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // activity type
    type: {
        type: String,
        trim: true,
        required: true
    },

    // title
    title: {
        type: String,
        trim: true,
        required: true
    },

    // activity content
    content: {
        type: String,
        trim: true,
    },

    // link
    link: {
        type: String,
        trim: true,
    },

    // Publicity of this post
    publicity: {
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

mongoose.model('Activity', Activity);