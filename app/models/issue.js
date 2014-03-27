var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

var Comment = require('./comment');

var Issue = new Schema({

    // Issue owner
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

    // Comments
    comments: [Comment],

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

mongoose.model('Issue', Issue);