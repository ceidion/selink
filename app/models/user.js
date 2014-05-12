var _ = require('underscore'),
    _s = require('underscore.string'),
    mongoose = require('mongoose'),
    validate = require('mongoose-validator').validate,
    Schema = mongoose.Schema;

// Sub documents
var Skill = require('./profile/skill'),
    Employment = require('./profile/employment'),
    Education = require('./profile/education'),
    Qualification = require('./profile/qualification'),
    Language = require('./profile/language');

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

    // Friend
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // Invited Friend
    invited: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // User Setting
    setting: {

        systemNotification: {
            type: Boolean,
            default: true
        },

        friendInvitation: {
            type: Boolean,
            default: true
        },

        invitationAccpected: {
            type: Boolean,
            default: true
        },

        friendNewPost: {
            type: Boolean,
            default: true
        },

        jobPost: {
            type: Boolean,
            default: true
        },

        postLiked: {
            type: Boolean,
            default: true
        },

        postCommented: {
            type: Boolean,
            default: true
        }
    },

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

User.methods.toSolr = function() {

    var languages = _.map(this.languages, function(language) {
        return language.language + '(' + language.weight + ')';
    });

    var skills = _.map(this.skills, function(skill) {
        return skill.skill + '(' + skill.weight + ')';
    });

    return {
        type: 'user',
        id: this.id,
        name: this.firstName + ' ' + this.lastName,
        email: this.email,
        title: this.title,
        birthDay: this.birthDay,
        gender: this.gender,
        nationality: this.nationality,
        marriage: this.marriage,
        telNo: this.telNo,
        webSite: this.webSite,
        address: this.address,
        nearestSt: this.nearestSt,
        skills: skills,
        languages: languages,
        // educations: this.educations,
        // employments: this.employments,
        // qualifications: this.qualifications,
        bio: _s.stripTags(this.bio),
        logicDelete: this.logicDelete
    };
};

mongoose.model('User', User);