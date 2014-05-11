var _s = require('underscore.string'),
    mongoose = require('mongoose'),
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

Post.methods.toSolr = function() {
    return {
        type: 'post',
        id: this.id,
        // owner: this._owner.firstName + ' ' + this._owner.lastName,
        // comments: this.comments,
        content: _s.stripTags(this.content),
        logicDelete: this.logicDelete
    };
};

mongoose.model('Post', Post);