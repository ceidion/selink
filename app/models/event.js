var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var Schema = mongoose.Schema;

var Event = new Schema({

    title: {
        type: String,
        trim: true,
        validate: validate('len', 0, 100)
    },
    allDay: {
        type: Boolean,
        default: false
    },
    start: {
        type: Date
    },
    end: {
        type: Date
    },
    className: {
        type: String,
        trim: true
    },
    memo: {
        type: String,
        trim: true
    },
    exclude: {
        type: String,
    },
    fee: {
        type: Number
    }
});

module.exports = Event;