var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

var Comment = require('./comment');

var Post = new Schema({

    // Post owner
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Post content
    content: {
        type: String,
        trim: true,
    },

    // Post summary
    summary: {
        type: String,
        trim: true,
    },

    // People who like this post
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // People who bookmarked this post
    bookmarked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Comments
    comments: [Comment],

    // Setting
    setting: {

        // Publicity of this post
        publicity: {
            type: String,
            trim: true,
            default: 'all'
        },

        commentable: {
            type: Boolean,
            default: true
        }
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