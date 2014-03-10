var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

var Comment = new Schema({

    // Comment owner
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Content
    content: {
        type: String,
        trim: true,
    },

    // People who like this Comment
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Publicity of this Comment
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

module.exports = Comment;