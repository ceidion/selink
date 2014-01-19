var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

// Sub documents
var Skill = require('./profile/skill');
var Language = require('./profile/language');

var Job = new Schema({

    // Job Owner
    owner: {
        type: Schema.Types.ObjectId
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
    // Native Only flag
    nativesOnly: {
        type: Boolean,
        default: false
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
    },
    // Creator
    createUser: {
        type: String,
        trim: true
    },
    // Modify Date
    updateDate: {
        type: Date,
        default: Date.now
    },
    // Modifier
    updateUser: {
        type: String,
        trim: true
    }
});

mongoose.model('Job', Job);