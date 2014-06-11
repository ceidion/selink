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
        validate: validate('len', 0, 100)
    },

    // Cover
    cover: {
        type: String,
        trim: true,
        default: './asset/images/default_cover.jpg'
    },

    // Description
    description: {
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