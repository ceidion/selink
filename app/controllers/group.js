var _ = require('underscore'),
    _s = require('underscore.string'),
    gm = require('gm'),
    util = require('util'),
    path = require('path'),
    mongoose = require('mongoose'),
    moment = require('moment'),
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
// Return latest 20 groups of current user in descending order of create date.
// In the case of get some user's groups list, user id must passed by the route: '/users/:user/groups'
// ---------------------------------------------
// Parameter:
//   1. user  : The user's id of groups list belong to, passed by url        default: current user
//   2. type  : The type of groups, identified by the path of request        default: joined
//                a. mine     -- the groups belong to user
//                b. joined   -- the groups user had joined
//                c. discover -- the groups that have no connection to user
//   3. before: A Unix time stamp used as start point of retrive             default: none
//   4. size  : Number of result to return                                   default: 20
// ---------------------------------------------

exports.index = function(req, res, next) {

    // TODO: check parameters

    // if the request was get some specific user's groups list
    // we need to get the user from users collection

    // if specified someone other than current user
    if (req.params.user && req.params.user !== req.user.id) {

        // get the user's groups info (group ids)
        User.findById(req.params.user, 'groups', function(err, uesr) {
            // pass the user to internal method
            if (err) next(err);
            else _group_index(req, res, uesr, next);
        });

    } else {

        // no specified user, pass null to internal method
        _group_index(req, res, req.user, next);
    }
};

// internal method for index
_group_index = function(req, res, user, next) {

    // create query
    var query = Group.find();

    // if request "mine" groups
    if (_s.endsWith(req.path, "/mine"))
        query.where('_owner').equals(user.id);

    // if request "discover" groups
    else if (_s.endsWith(req.path, "/discover"))
        query.where('_id').nin(user.groups);

    // default to joined groups
    else
        query.where('_id').in(user.groups);

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    query.select('_owner type name cover description participants posts events createDate')
        .where('logicDelete').equals(false)
        .limit(req.query.size || 20)
        .sort('-createDate')
        .exec(function(err, groups) {
            if (err) next(err);
            else if (groups.length === 0) res.json(404, {});
            else res.json(groups);
        });
};

// Get single user
// ---------------------------------------------
// Retrun user profile info except password

exports.show = function(req, res, next) {

    // check on logic delete flag, return 404 on not found

    Group.findById(req.params.group)
        .select('-logicDelete')
        .where('logicDelete').equals(false)
        .populate('_owner', populateField['_owner'])
        .exec(function(err, group) {
            if (err) next(err);
            else res.json(group);
        });
};

// Group Connection
// ---------------------------------------------
// Return 20 people's info of the group member/invited member in descending order of create date.
// ---------------------------------------------
// Parameter:
//   1. group : The group id of user list belong to, passed by url           default: none
//   2. type  : The type of member, identified by the path of request        default: participants
//                a. participants  -- the groups belong to user
//                b. invited       -- the groups user had joined
//   3. before: A Unix time stamp used as start point of retrive             default: none
//   4. size  : Number of result to return                                   default: 20
// ---------------------------------------------

exports.connections = function(req, res, next) {

    // TODO: check parameters

    // create query
    var query = Group.findById(req.params.group)
                    .where('logicDelete').equals(false);

    // if request invited people
    if (_s.endsWith(req.path, "/invited"))
        query.select('invited')
            .populate('invited', populateField['invited'])
            .exec(function(err, group) {
                if (err) next(err);
                else res.json(group.invited);
            });

    // default to participants
    else
        query.select('participants')
            .populate('participants', populateField['participants'])
            .exec(function(err, group) {
                if (err) next(err);
                else res.json(group.participants);
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