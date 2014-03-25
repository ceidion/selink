var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

// Sub documents
var Skill = require('./profile/skill');
var Language = require('./profile/language');

var Job = new Schema({

    // Job Owner
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Name
    name: {
        type: String,
        trim: true,
        validate: validate('len', 0, 100)
    },

    // Expired Date
    expiredDate: {
        type: Date
    },

    // Start Date
    startDate: {
        type: Date
    },

    // End Date
    endDate: {
        type: Date
    },

    // Top Price
    priceTop: {
        type: Number,
        validate: validate({passIfEmpty: true}, 'isInt')
    },

    // Bottom Price
    priceBottom: {
        type: Number,
        validate: validate({passIfEmpty: true}, 'isInt')
    },

    // Working Place
    address: {
        type: String,
        trim: true,
        validate: validate('len', 0, 80)
    },

    // Foreigner allowed flag
    foreignerAllowed: {
        type: Boolean,
        default: true
    },

    // Number of Recruit
    recruitNum: {
        type: Number,
        validate: validate({passIfEmpty: true}, 'isInt')
    },

    // Number of Interview
    interviewNum: {
        type: Number,
        validate: validate({passIfEmpty: true}, 'isInt')
    },

    // Language
    languages: [Language],

    // Skill
    skills: [Skill],

    // Remark
    remark: {
        type: String,
        trim: true,
        validate: validate('len', 0, 5000)
    },

    // Publish status
    public: {
        type: Boolean,
        default: true
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

mongoose.model('Job', Job);