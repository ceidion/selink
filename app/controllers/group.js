var _ = require('underscore'),
    _s = require('underscore.string'),
    gm = require('gm'),
    util = require('util'),
    path = require('path'),
    mongoose = require('mongoose'),
    Mailer = require('../mailer/mailer.js'),
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

// Show single group
exports.show = function(req, res, next) {

    Group.findById(req.params.group)
        .where('logicDelete').equals(false)
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .exec(function(err, group) {
            if (err) next(err);
            else res.json(group);
        });
};

// Create group
exports.create = function(req, res, next) {

    Group.create({
        _owner: req.user.id,
        name: req.body.name
    }, function(err, group) {
        if (err) next(err);
        else res.json(group);
    });
};

// Edit group
exports.update = function(req, res, next) {

    delete req.body._id;

    // update group info
    Group.findByIdAndUpdate(req.params.group, req.body, function(err, group) {

        if (err) next(err);
        else res.json(group);
    });
};

// Upload Cover
exports.uploadCover = function(req, res, next) {

    // handle cover file
    if (req.files && req.files.cover) {

        console.log(req.files.cover);

        var coverType = req.files.cover.type;
        var coverPath = req.files.cover.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(coverType) === -1) {
            res.status(415).send("Only jpeg, gif or png file are valide");
            return;
        }

        var coverName = /.*[\/|\\](.*)$/.exec(coverPath)[1];

        req.session.tempCover = coverName;

        gm(coverPath).size(function(err, size) {
            if (err) next(err);
            else res.json({fileName: './upload/' + coverName});
        });

    } else {
        res.json(400, {});
    }
};

// Scale Cover
exports.scaleCover = function(req, res, next) {

    // TODO: check exsitence of tempCover

    var coverPath = path.join(__dirname, '../../public/upload/', req.session.tempCover);

    gm(coverPath)
        .crop(req.body.w, req.body.h, req.body.x, req.body.y)
        .write(coverPath, function(err) {
            if (err) next(err);
            else {

                // update group info
                Group.findByIdAndUpdate(req.params.group, {cover: './upload/' + req.session.tempCover}, function(err, group) {
                    if (err) next(err);
                    else res.send({cover: group.cover});
                });
            }
        });
};