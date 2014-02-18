var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

var Post = new Schema({

    // Post owner
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

    // People who like this post
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

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

mongoose.model('Post', Post);