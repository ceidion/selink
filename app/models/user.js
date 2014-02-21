var mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

// Sub documents
var Skill = require('./profile/skill'),
    Employment = require('./profile/employment'),
    Education = require('./profile/education'),
    Qualification = require('./profile/qualification'),
    Language = require('./profile/language'),
    Event = require('./event'),
    Notification = require('./notification');

var User = new Schema({

    // Primary email
    email: {
        type: String,
        trim: true
    },

    // Password
    password: {
        type: String,
        trim: true
    },

    // User type
    type: {
        type: String,
        trim: true
    },

    // Provider
    provider: {
        type: String,
        trim: true
    },

    // First Name
    firstName: {
        type: String,
        trim: true,
        validate: validate('len', 0, 20)
    },

    // Last Name
    lastName: {
        type: String,
        trim: true,
        validate: validate('len', 0, 20)
    },

    // Photo
    photo: {
        type: String,
        trim: true
    },

    // Title
    title: {
        type: String,
        trim: true,
        validate: validate('len', 0, 50)
    },

    // Birth Day
    birthDay: {
        type: Date
    },

    // Gender
    gender: {
        type: String,
        trim: true
    },

    // Nationality
    nationality: {
        type: String,
        trim: true,
        validate: validate('len', 0, 50)
    },

    // Marriage
    marriage: {
        type: String,
        trim: true
    },

    // Tel No
    telNo: {
        type: String,
        trim: true,
        validate: validate('len', 0, 20)
    },

    // E-mail
    secEmail: {
        type: String,
        trim: true,
        validate: validate({passIfEmpty: true}, 'isEmail')
    },

    // Personal WebSite
    webSite: {
        type: String,
        trim: true,
        validate: validate({passIfEmpty: true}, 'isUrl')
    },

    // Zip Code
    zipCode: {
        type: String,
        trim: true,
        validate: validate('len', 0, 8)
    },

    // Address
    address: {
        type: String,
        trim: true,
        validate: validate('len', 0, 80)
    },

    // Nearest Station
    nearestSt: {
        type: String,
        trim: true,
        validate: validate('len', 0, 30)
    },

    // Work Experience
    experience: {
        type: Number,
        validate: validate({passIfEmpty: true}, 'isInt')
    },

    // Self Introduction
    bio: {
        type: String,
        trim: true,
        validate: validate('len', 0, 5000)
    },

    // Language
    languages: [Language],

    // Education
    educations: [Education],

    // Employment
    employments: [Employment],

    // Qualification
    qualifications: [Qualification],

    // Skill
    skills: [Skill],

    // Event
    events: [Event],

    notifications: [Notification],

    // Friend
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Friend waiting for approve
    waitApprove: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],

    messages: [Schema.Types.ObjectId],

    sents:[Schema.Types.ObjectId],

    drafts:[Schema.Types.ObjectId],

    // Last login date
    lastLogin: {
        type: Date
    },

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

mongoose.model('User', User);