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
        .populate('invited', 'type firstName lastName title cover photo createDate')
        .populate('participants', 'type firstName lastName title cover photo createDate')
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
        else {

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'new-group',
                target: group._id
            }, function(err, activity) {
                if (err) next(err);
            });

            // send notificaton to all friends
            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'new-group',
                target: group._id
            }, function(err, notification) {
                if (err) next(err);
                else {
                    // populate the respond notification with user's info
                    notification.populate({
                        path:'_from',
                        select: 'type firstName lastName title cover photo createDate'
                    }, function(err, noty) {
                        if(err) next(err);
                        // send real time message
                        else
                            req.user.friends.forEach(function(room) {
                                sio.sockets.in(room).emit('new-group', noty);
                            });
                    });
                }
            });

            res.json(group);
        }
    });
};

// Edit group
exports.update = function(req, res, next) {

    delete req.body._id;
    delete req.body.invited;

    // update group info
    Group.findByIdAndUpdate(req.params.group, req.body, function(err, group) {

        if (err) next(err);
        else {

            group.populate({
                path:'invited',
                select: 'type firstName lastName title cover photo createDate'
            }, function(err, group) {

                if (err) next(err);
                else res.json(group);
            });
        }
    });
};

// Invite people into group
exports.invite = function(req, res, next) {

    if (req.body.invited) {

        // update group info
        Group.findById(req.params.group, function(err, group) {

            if (err) next(err);
            else {

                req.body.invited.forEach(function(userId) {
                    group.invited.addToSet(userId);
                });

                group.save(function(err, newGroup) {

                    if (err) next(err);
                    else {

                        // create activity
                        Activity.create({
                            _owner: req.user.id,
                            type: 'group-invited',
                            target: newGroup._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // send notificaton to all friends
                        Notification.create({
                            _owner: req.body.invited,
                            _from: req.user.id,
                            type: 'group-invited',
                            target: newGroup._id
                        }, function(err, notification) {
                            if (err) next(err);
                            else {
                                // populate the respond notification with user's info
                                notification.populate({
                                    path:'_from',
                                    select: 'type firstName lastName title cover photo createDate'
                                }, function(err, noty) {
                                    if(err) next(err);
                                    // send real time message
                                    else
                                        req.body.invited.forEach(function(room) {
                                            sio.sockets.in(room).emit('group-invited', noty);
                                        });
                                });
                            }
                        });

                        // // send email to all friends
                        // User.find()
                        //     .select('email')
                        //     .where('_id').in(req.user.friends)
                        //     .where('logicDelete').equals(false)
                        //     .exec(function(err, users) {
                        //         // send new-post mail
                        //         Mailer.newPost(users, {
                        //             _id: newPost._id,
                        //             authorName: req.user.firstName + ' ' + req.user.lastName,
                        //             authorPhoto: req.user.photo,
                        //             summary: newPost.summary
                        //         });
                        //     });

                        var populateQuery = [{
                            path:'invited',
                            select: 'type firstName lastName title cover photo createDate'
                        }, {
                            path:'participants',
                            select: 'type firstName lastName title cover photo createDate'
                        }];

                        newGroup.populate(populateQuery, function(err, group) {
                            if (err) next(err);
                            else res.json(group);
                        });
                    }
                });

            }
        });

    } else {
        res.json(400, {});
    }
};

// Join group
exports.join = function(req, res, next) {

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