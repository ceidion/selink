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

var populateField = {
    _owner: 'type firstName lastName title cover photo',
    invited: 'type firstName lastName title cover photo',
    participants: 'type firstName lastName title cover photo'
};

// Group index
// ---------------------------------------------
// Return a list of 20 groups in descending order of create date.
// In the case of get some user's groups list, user id must passed by the route: '/users/:user/groups'
// ---------------------------------------------
// Parameter:
//   1. user  : The user's id of groups list belong to, passed by url  default: none
//   2. fields: Comma separate select fields for output               default: none
//   3. embed : Comma separate embeded fields for populate            default: none
//   4. sort  : Fields name used for sort                             default: createDate
//   5. page  : page number for pagination                            default: 0
//   6. per_page: record number of every page                         default: 20
// ---------------------------------------------

exports.index = function(req, res, next) {

    // TODO: check parameters

    // if the request was get some specific user's groups list
    // we need to get the user from users collection

    // if the specified user is current user
    if (req.params.user && req.params.user === req.user.id) {

        // pass current user to internal method
        _group_index(req, res, req.user, next);

    // if specified someone else
    } else if (req.params.user) {

        // get the user's groups info (group ids)
        User.findById(req.params.user, 'groups', function(err, uesr) {
            // pass the user to internal method
            if (err) next(err);
            else _group_index(req, res, uesr, next);
        });

    } else {

        // no specified user, pass null to internal method
        _group_index(req, res, null, next);
    }
};

// internal method for index
_group_index = function(req, res, user, next) {

    // create query
    var query = Group.find();

    // if request specified user
    if (user)
        query.where('_id').in(user.groups);

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {
            query.populate(field, populateField[field]);
        });
    }

    // if request specified sort order and pagination
    var sort = req.query.sort || '-createDate',
        page = req.query.page || 0,
        per_page = req.query.per_page || 20;

    query.where('logicDelete').equals(false)
        .skip(page*per_page)
        .limit(per_page)
        .sort(sort)
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
        .populate('events')
        .exec(function(err, group) {
            if (err) next(err);
            else res.json(group);
        });
};

// Create group
exports.create = function(req, res, next) {

    Group.create({
        _owner: req.user.id,
        name: req.body.name,
        participants: req.user.id
    }, function(err, group) {
        if (err) next(err);
        else {

            // put group id in creator's group list
            req.user.groups.push(group.id);
            req.user.save(function(err) {
                if (err) next(err);
            });

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'group-new',
                targetGroup: group._id
            }, function(err, activity) {
                if (err) next(err);
            });

            // send notificaton to all friends
            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'group-new',
                targetGroup: group._id
            }, function(err, notification) {
                if (err) next(err);
                else {

                    var notyPopulateQuery = [{
                        path:'_from',
                        select: 'type firstName lastName title cover photo createDate'
                    },{
                        path:'targetGroup'
                    }];

                    // populate the respond notification with user's info
                    notification.populate(notyPopulateQuery, function(err, noty) {
                        if(err) next(err);
                        // send real time message
                        else
                            req.user.friends.forEach(function(room) {
                                sio.sockets.in(room).emit('group-new', noty);
                            });
                    });
                }
            });

            // index group in solr
            solr.add(group.toSolr(), function(err, solrResult) {
                if (err) next(err);
                else {
                    console.log(solrResult);
                    solr.commit(function(err,res){
                       if(err) console.log(err);
                       if(res) console.log(res);
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

            // index group in solr
            solr.add(group.toSolr(), function(err, solrResult) {
                if (err) next(err);
                else {
                    console.log(solrResult);
                    solr.commit(function(err,res){
                       if(err) console.log(err);
                       if(res) console.log(res);
                    });
                }
            });

            var populateQuery = [{
                path: 'invited',
                select: 'type firstName lastName title cover photo createDate'
            }, {
                path: 'participants',
                select: 'type firstName lastName title cover photo createDate'
            }, {
                path: 'events'
            }];

            group.populate(populateQuery, function(err, group) {

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
                            targetGroup: newGroup._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // send notificaton to all friends
                        Notification.create({
                            _owner: req.body.invited,
                            _from: req.user.id,
                            type: 'group-invited',
                            targetGroup: newGroup._id
                        }, function(err, notification) {
                            if (err) next(err);
                            else {

                                var notyPopulateQuery = [{
                                    path:'_from',
                                    select: 'type firstName lastName title cover photo createDate'
                                },{
                                    path:'targetGroup'
                                }];

                                // populate the respond notification with user's info
                                notification.populate(notyPopulateQuery, function(err, noty) {
                                    if(err) next(err);
                                    // send real time message
                                    else
                                        req.body.invited.forEach(function(room) {
                                            sio.sockets.in(room).emit('group-invited', noty);
                                        });
                                });
                            }
                        });

                        // send email to all friends
                        User.find()
                            .select('email')
                            .where('_id').in(req.body.invited)
                            .where('logicDelete').equals(false)
                            .exec(function(err, users) {
                                // send new-post mail
                                Mailer.groupInvitation(users, {
                                    _id: newGroup._id,
                                    ownerId: req.user.id,
                                    ownerName: req.user.firstName + ' ' + req.user.lastName,
                                    ownerPhoto: req.user.photo,
                                    name: newGroup.name,
                                    cover: newGroup.cover,
                                    description: newGroup.description
                                });
                            });

                        var populateQuery = [{
                            path:'invited',
                            select: 'type firstName lastName title cover photo createDate'
                        }, {
                            path:'participants',
                            select: 'type firstName lastName title cover photo createDate'
                        }, {
                            path: 'events'
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

    // update group info
    Group.findById(req.params.group, function(err, group) {

        if (err) next(err);
        else {

            // save the group id in user profile
            req.user.groups.addToSet(group._id);
            req.user.save(function(err) {
                if (err) next(err);
            });

            // remove user's id from group's invited list, in case he had been invited
            group.invited.pull(req.user._id);
            // add user id to group participants
            group.participants.addToSet(req.user.id);
            // update group
            group.save(function(err, group) {

                if (err) next(err);
                else {

                    // create respond notification
                    Notification.create({
                        _owner: group._owner,
                        _from: req.user.id,
                        type: 'group-joined',
                        targetGroup: group._id
                    }, function(err, respond) {

                        if (err) next(err);
                        else {

                            var notyPopulateQuery = [{
                                path:'_from',
                                select: 'type firstName lastName title cover photo createDate'
                            },{
                                path:'targetGroup'
                            }];

                            // populate the respond notification with user's info
                            respond.populate(notyPopulateQuery, function(err, noty) {

                                if (err) next(err);
                                // send real time message
                                else sio.sockets.in(group._owner._id).emit('group-joined', noty);
                            });
                        }
                    });

                    // log user's activity
                    Activity.create({
                        _owner: req.user.id,
                        type: 'group-joined',
                        targetGroup: group._id
                    }, function(err) {
                        if (err) next(err);
                    });

                    // send email to group owner
                    User.findById(group._owner)
                        .select('email')
                        .where('logicDelete').equals(false)
                        .exec(function(err, recipient) {

                            Mailer.groupJoin({
                                email: recipient.email,
                                groupName: group.name,
                                participant: req.user
                            });
                        });

                    var populateQuery = [{
                        path:'_owner',
                        select: 'type firstName lastName title cover photo createDate'
                    }, {
                        path: 'participants',
                        select: 'type firstName lastName title cover photo createDate'
                    }, {
                        path:'events'
                    }];

                    // return updated group
                    group.populate(populateQuery, function(err, group) {

                        if (err) next(err);
                        else res.json(group);
                    });
                }
            });
        }
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
        .resize(600, 150)
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