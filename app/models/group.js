var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

var Group = new Schema({

    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Group type
    type: {
        type: String,
        trim: true
    },

    // Group Name
    name: {
        type: String,
        required: true,
        trim: true,
        validate: validate('len', 0, 20)
    },

    // Cover
    cover: {
        type: String,
        trim: true
    },

    // Title
    title: {
        type: String,
        trim: true,
        validate: validate('len', 0, 50)
    },

    // Introduction
    bio: {
        type: String,
        trim: true,
        validate: validate('len', 0, 5000)
    },

    // Group Participants
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Invited Participants
    invited: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Logic delete flag
    logicDelete: {
        type: Boolean,
        default: false
    },

    // Create date
    createDate: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Group', Group);