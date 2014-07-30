var _s = require('underscore.string'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Mailer = require('../mailer/mailer.js'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

var populateField = {
    '_from': 'type firstName lastName title cover photo'
};

/*
    Notification Type:
    1. friend-invited
    2. friend-approved
    3. friend-declined
    4. friend-break
    5. post-new
    6. post-liked
    7. post-bookmarked
    8. post-commented
    9. comment-liked
    10. job-new
    11. job-bookmarked
    12. message-new
    13. group-new
    14. group-invited
    15. group-joined
    16. group-refused
*/

// Notification index
// ---------------------------------------------
// Return a list of 20 notifications of current user, in descending order of create date.
// Notifications are private, all requests are relate to current user and can't be changed
// ---------------------------------------------
// Parameter:
//   1. type  : The type of notifications, "unconfirmed" or "all"  default: all
//   2. before: A Unix time stamp used as start point of retrive   default: none
//   3. size  : Number of result to return                         default: 20
// ---------------------------------------------

exports.index = function(req, res, next) {

    // create query
    var query = Notification.find();

    // notifications are relate with current user
    query.where('_owner').equals(req.user.id);

    // if request specified unconfirmed notifications
    if (_s.endsWith(req.path, "/unconfirmed"))
        query.where('confirmed').ne(req.user.id);

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    query.select('-logicDelete')
        .where('logicDelete').equals(false)
        .populate('_from', populateField['_from'])
        .populate('targetPost')
        .populate('targetJob')
        .populate('targetMessage')
        .populate('targetGroup')   // there is no targetComment, cause comment was embedded in post
        .limit(req.query.size || 20)
        .sort('-createDate')
        .exec(function(err, notifications) {
            if (err) next(err);
            else if (notifications.length === 0) res.json(404, {});
            else res.json(notifications);
        });

};

// Notification count
// ---------------------------------------------
// Return the number notifications of current user, in request specified criteria.
// Notifications are private, all requests are relate to current user and can't be changed
// ---------------------------------------------
// Parameter:
//   1. type  : The type of notifications, "unconfirmed" or "all"  default: all
// ---------------------------------------------

exports.count = function(req, res, next) {

    // create query
    var query = Notification.count();

    // notifications are relate with current user
    query.where('_owner').equals(req.user.id);

    // if request specified unconfirmed notifications
    if (_s.endsWith(req.path, "/unconfirmed/count"))
        query.where('confirmed').ne(req.user.id);

    query.where('logicDelete').equals(false)
        .exec(function(err, count) {
            if (err) next(err);
            else res.json({count: count});
        });
};

// Update Notification
exports.update = function(req, res, next) {

    // get the notification
    Notification.findOne({
        _id: req.params.notification,
        _owner: req.user.id,  // ensure notification owner is current user
        confirmed: {'$ne': req.user.id}  // only the unconfirmed notification
    }, function(err, notification) {

        // if error exist
        if (err) next(err);

        // if notification not exist
        else if (!notification || !req.body.result) {
            res.json(404, {});
        }

        // approve friend invitation
        else if (req.body.result == "approved") {
            approve(req, res, next, notification);
        }

        // decline friend invitation
        else if (req.body.result == "declined") {
            decline(req, res, next, notification);
        }

        // accept group invitation
        else if (req.body.result == "accepted") {
            accept(req, res, next, notification);
        }

        // refuse group invitation
        else if (req.body.result == "refused") {
            refuse(req, res, next, notification);
        }

        // acknowledge a notification
        else if (req.body.result == "acknowledged") {
            acknowledge(req, res, next, notification);
        }
    });
};

// Approve friend invitation
// ---------------------------------------------
// Add a friend to the friends list of current user. This request will:
//   1. update the "invited" and "friends" field for current user
//   2. update the "invited" and "friends" field for target user
//   3. update the "result" field for notification as "approved"
//   4. create "friend-approved" activity for current user
//   5. create "friend-approved" notification for target user
//   6. send real time message to target user
//   7. send Email to target user
// ---------------------------------------------
// Parameter:
//   1. id  : The user's id that was approved
// ---------------------------------------------

approve = function(req, res, next, notification) {

    async.parallel({

        // add the friend's id into user's friends list
        updateUser: function(callback) {

            // remove the request sender's id from user's invited list
            // (in case they invited each other)
            req.user.invited.pull(notification._from);
            // add the request sender's id into user's friend list
            req.user.friends.addToSet(notification._from);

            req.user.save(callback);
        },

        // find that friend, add current user to his friend list
        updateFriend: function(callback) {

            User.findByIdAndUpdate(notification._from, {
                '$pull': {invited: req.user.id},
                '$push': {friends: req.user.id},
            }, callback);
        },

        // mark the notification as confirmed
        updateNotification: function(callback) {

            notification.result = req.body.result;
            notification.confirmed.addToSet(req.user.id);
            notification.save(callback);
        },

        // create activity for current user
        createActivity: function(callback) {

            Activity.create({
                _owner: req.user.id,
                type: 'friend-approved',
                targetUser: notification._from
            }, callback);
        },

        // create notification for target user
        createNotification: function(callback) {

            Notification.create({
                _owner: notification._from,
                _from: req.user.id,
                type: 'friend-approved'
            }, function(err, noty) {

                if (err) callback(err);
                else {

                    // send real time message to target user
                    sio.sockets.in(notification._from).emit('friend-approved', {
                        _id: noty._id,
                        _from: {
                            type: req.user.type,
                            firstName: req.user.firstName,
                            lastName: req.user.lastName,
                            title: req.user.title,
                            cover: req.user.cover,
                            photo: req.user.photo
                        },
                        type: 'friend-approved',
                        createDate: new Date()
                    });

                    callback(null);
                }
            });
        },

        // send Email to target user
        sendEmail: function (callback) {

            User.findById(notification._from, 'email', function(err, user){
                if (err) callback(err);
                else {

                    Mailer.friendApprove({
                        from: req.user,
                        email: user.email
                    });

                    callback(null);
                }
            });
        }

    }, function(err, results) {

        if (err) next(err);
        // return the updated notification
        else res.json(results.updateNotification[0]);
    });

};

// Decline friend invitation
// ---------------------------------------------
// Remove a friend from the invited list of the user who create invitation. This request will:
//   1. update the "invited" field for target user
//   2. update the "result" field for notification as "declined"
//   3. create "friend-declined" activity for current user
//   4. create "friend-declined" notification for target user
//   5. send real time message to target user
// ---------------------------------------------
// Parameter:
//   1. id  : The user's id that was declined
// ---------------------------------------------

decline = function(req, res, next, notification) {

    async.parallel({

        // remove user's id from request sender's invited list
        updateUser: function(callback) {

            User.findByIdAndUpdate(notification._from, {
                '$pull': {invited: req.user.id}
            }, callback);
        },

        // mark the notification as confirmed
        updateNotification: function(callback) {

            notification.result = req.body.result;
            notification.confirmed.addToSet(req.user.id);
            notification.save(callback);
        },

        // create activity for current user
        createActivity: function(callback) {

            Activity.create({
                _owner: req.user.id,
                type: 'friend-declined',
                targetUser: notification._from
            }, callback);
        },

        // create notification for target user
        createNotification: function(callback) {

            Notification.create({
                _owner: notification._from,
                _from: req.user.id,
                type: 'friend-declined'
            }, function(err, noty) {

                if (err) callback(err);
                else {

                    // send real time message to target user
                    sio.sockets.in(notification._from).emit('friend-declined', {
                        _id: noty._id,
                        _from: {
                            type: req.user.type,
                            firstName: req.user.firstName,
                            lastName: req.user.lastName,
                            title: req.user.title,
                            cover: req.user.cover,
                            photo: req.user.photo
                        },
                        type: 'friend-declined',
                        createDate: new Date()
                    });

                    callback(null);
                }
            });
        }

    }, function(err, results) {

        if (err) next(err);
        // return the updated notification
        else res.json(results.updateNotification[0]);
    });

};

accept = function(req, res, next, notification) {

    // find target group
    Group.findById(notification.targetGroup, function(err, group){

        if (err) next(err);
        else {

            // save the group id in user profile
            req.user.groups.addToSet(group._id);
            req.user.save(function(err) {
                if (err) next(err);
            });

            // move user's id from group's invited list
            // to the participants list
            group.invited.pull(req.user._id);
            group.participants.addToSet(req.user._id);

            // update group
            group.save(function(err, updatedGroup) {

                if (err) next(err);
                else {

                    // create respond notification
                    Notification.create({
                        _owner: updatedGroup._owner,
                        _from: req.user.id,
                        type: 'group-joined',
                        targetGroup: updatedGroup._id
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
                                else sio.sockets.in(updatedGroup._owner).emit('group-joined', noty);
                            });
                        }
                    });

                    // log user's activity
                    Activity.create({
                        _owner: req.user.id,
                        type: 'group-joined',
                        targetGroup: updatedGroup._id
                    }, function(err) {
                        if (err) next(err);
                    });

                    // send email to group owner
                    User.findById(updatedGroup._owner)
                        .select('email')
                        .where('logicDelete').equals(false)
                        .exec(function(err, recipient) {

                            Mailer.groupJoin({
                                email: recipient.email,
                                groupName: updatedGroup.name,
                                participant: req.user
                            });
                        });

                    // mark the notification as confirmed
                    notification.result = req.body.result;
                    notification.confirmed.addToSet(req.user.id);
                    notification.save(function(err, confirmedNotification) {
                        if (err) next(err);
                        else res.json(confirmedNotification);
                    });

                }
            });
        }
    });
};

refuse = function(req, res, next, notification) {

    // find target group
    Group.findById(notification.targetGroup, function(err, group){

        if (err) next(err);
        else {

            // remove user's id from group's invited list
            group.invited.pull(req.user._id);

            // update group
            group.save(function(err, updatedGroup) {

                if (err) next(err);
                else {

                    // create respond notification
                    Notification.create({
                        _owner: updatedGroup._owner,
                        _from: req.user.id,
                        type: 'group-refused',
                        targetGroup: updatedGroup._id
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

                                if(err) next(err);
                                // send real time message
                                else sio.sockets.in(updatedGroup._owner).emit('group-refused', noty);
                            });
                        }
                    });

                    // log user's activity
                    Activity.create({
                        _owner: req.user.id,
                        type: 'group-refused',
                        targetGroup: updatedGroup._id
                    }, function(err) {
                        if (err) next(err);
                    });

                    // mark the notification as confirmed
                    notification.result = req.body.result;
                    notification.confirmed.addToSet(req.user.id);
                    notification.save(function(err, confirmedNotification) {
                        if (err) next(err);
                        else res.json(confirmedNotification);
                    });
                }
            });
        }
    });
};

acknowledge = function(req, res, next, notification) {

    // mark the notification as confirmed
    notification.result = req.body.result;
    notification.confirmed.addToSet(req.user.id);
    notification.save(function(err, notification) {
        if (err) next(err);
        else res.json(notification);
    });
};