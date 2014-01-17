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
    }
});

mongoose.model('Tag', Tag);