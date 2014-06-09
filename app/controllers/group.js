var _ = require('underscore'),
    _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    util = require('util'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Group index
exports.index = function(req, res, next) {

    var user = req.query.user || null,
        page = req.query.page || 0;            // page number

    var query = Group.find();

    // if requested for 'someone' groups
    if (user) {
        query.where('_owner').equals(user);
    // or requested for 'my' groups
    } else {
        query.where('_owner').equals(req.user.id);
    }

    query.where('logicDelete').equals(false)
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .skip(20*page)  // skip n page
        .limit(20)
        .sort('-createDate')
        .exec(function(err, groups) {
            if (err) next(err);
            else res.json(groups);
        });
};

// Create group
exports.create = function(req, res, next) {


}