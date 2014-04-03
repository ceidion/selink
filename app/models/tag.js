var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Tag = new Schema({
    name: {
        type: String,
        trim: true
    },
    count: {
        type: Number,
    },
    wikis: {
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

mongoose.model('Tag', Tag);