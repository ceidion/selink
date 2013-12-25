var moment = require('moment');
var markdown = require('markdown').markdown;
var mongoose = require('mongoose');
var validate = require('mongoose-validator').validate;
var metadata = require('./metadata');
var Schema = mongoose.Schema;

// Sub documents
// var Skill = require('./skill');
// var Career = require('./career');
// var Education = require('./education');
// var Qualification = require('./qualification');
// var WorkExperience = require('./workexperience');
// var LanguageBackground = require('./languagebackground');

var Profile = new Schema({

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
        trim: true,
        enum: metadata.gender_option
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
        trim: true,
        enum: metadata.married_option
    },
    // Availability
    availableDate: {
        type: Date
    },
    // Tel No
    telNo: {
        type: String,
        trim: true,
        validate: validate('len', 0, 20)
    },
    // E-mail
    email: {
        type: String,
        trim: true,
        validate: validate({passIfEmpty: true}, 'isEmail')
    },
    // Home Page
    homePage: {
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
        validate: validate('isInt')
    },
    // Self Introduction
    selfIntroduction: {
        type: String,
        trim: true,
        validate: validate('len', 0, 5000)
    },
    // // Language Background
    // languageBackground: [LanguageBackground],
    // // Education
    // education: [Education],
    // // Career
    // career: [Career],
    // // Work Experience
    // workExperience: [WorkExperience],
    // // Qualification
    // qualification: [Qualification],
    // // Skill
    // skill: [Skill],
    // BackGround Image
    backgroundImg: {
        type: String,
        trim: true,
        default: "page-bg.png"
    },
    // Profile Template
    template: {
        type: String,
        trim: true,
        default: "default"
    },
    // Share ID
    shareId: {
        type: String,
        trim: true,
        unique: true
    },
    // Item open flag
    setting: {
        name: {
            type: Boolean,
            default: true
        },
        photo: {
            type: Boolean,
            default: true
        },
        title: {
            type: Boolean,
            default: true
        },
        birthDay: {
            type: Boolean,
            default: true
        },
        gender: {
            type: Boolean,
            default: true
        },
        nationality: {
            type: Boolean,
            default: false
        },
        married: {
            type: Boolean,
            default: false
        },
        availableDate: {
            type: Boolean,
            default: false
        },
        telNo: {
            type: Boolean,
            default: true
        },
        email: {
            type: Boolean,
            default: true
        },
        homePage: {
            type: Boolean,
            default: true
        },
        address: {
            type: Boolean,
            default: true
        },
        selfIntroduction: {
            type: Boolean,
            default: true
        },
        languageBackground: {
            type: Boolean,
            default: true
        },
        education: {
            type: Boolean,
            default: true
        },
        career: {
            type: Boolean,
            default: true
        },
        workExperience: {
            type: Boolean,
            default: true
        },
        qualification: {
            type: Boolean,
            default: true
        },
        skill: {
            type: Boolean,
            default: true
        },
        // Flag of frist visit
        isFirstVisit: {
            type: Boolean,
            default: true
        },
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

// Virtuals
Profile.virtual('birthDayStr').get(function() {
    if (this.birthDay)
        return moment(new Date(this.birthDay)).format('LL');
    else
        return "";
});

Profile.virtual('availableDateStr').get(function() {
    if (this.availableDate)
        return moment(new Date(this.availableDate)).format('LL');
    else
        return "";
});

Profile.virtual('addressStr').get(function() {
    if (this.zipCode)
        return '〒' + this.zipCode + '）' + this.address;
    else
        return this.address;
});

Profile.virtual('selfIntroductionStr').get(function() {
    if (this.selfIntroduction)
        return markdown.toHTML(this.selfIntroduction);
    else
        return "";
});

Profile.virtual('description').get(function() {
    if (this.selfIntroduction)
        return this.selfIntroduction.substr(0, 200);
    else
        return "";
});

mongoose.model('Profile', Profile);