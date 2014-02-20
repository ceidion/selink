var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Notification = new Schema({

    // request sender
    _from: {
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

module.exports = Notification;