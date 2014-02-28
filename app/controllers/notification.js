var request = require('request'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

/* Notification Type:
    1. user-friend-invited
    2. user-friend-approved
    3. user-friend-declined
*/

// Notification index
exports.index = function(req, res, next) {

    // find the notifications of specific user
    Notification.find({_owner: req.user.id, confirmed: false})
        .limit(20)
        .populate('_from', 'firstName lastName photo')
        .exec(function(err, notifications) {
            if (err) next(err);
            else res.json(notifications);
        });
};

// Update Notification
exports.update = function(req, res, next) {

    // get the notification
    Notification.findOne({
        _id: req.params.notification,
        _owner: req.user.id,  // ensure notification owner is current user
        confirmed: false  // only the unconfirmed notification
    }, function(err, notification) {

        // if error exist
        if (err) next(err);

        // if notification not exist
        else if (!notification || !req.body.result) {
            res.status(404).json({
                msg: "更新失敗しました"
            });
        }

        // approve friend invitation
        else if (req.body.result == "approved") {
            approve(req, res, next, notification);
        }

        // decline friend invitation
        else if (req.body.result == "declined") {
            decline(req, res, next, notification);
        }

        // acknowledge a notification
        else if (req.body.result == "acknowledged") {
            acknowledge(req, res, next, notification);
        }
    });
};

approve = function(req, res, next, notification) {

    // remove the request sender's id from user's invited list
    // (in case they invited each other)
    req.user.invited.pull(notification._from);

    // add the request sender's id into user's friend list
    req.user.friends.push(notification._from);

    // update user
    req.user.save(function(err) {

        if (err) next(err);
        else {

            // find request sender
            User.findById(notification._from, function(err, friend){

                // move user's id from request sender's invited list
                // to the friend list
                friend.invited.pull(req.user._id);
                friend.friends.push(req.user._id);

                // update request sender
                friend.save(function(err, updatedFriend) {

                    // create respond notification
                    Notification.create({
                        _owner: updatedFriend.id,
                        _from: req.user.id,
                        type: 'user-friend-approved'
                    }, function(err, respond) {

                        if (err) next(err);
                        else {
                            // populate the respond notification with user's info
                            respond.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                                if(err) next(err);
                                // send real time message
                                sio.sockets.in(updatedFriend.id).emit('user-friend-approved', noty);
                            });
                        }
                    });

                    // mark the notification as confirmed
                    notification.result = req.body.result;
                    notification.confirmed = true;
                    notification.save(function(err, confirmedNotification) {
                        if (err) next(err);
                        else res.json(confirmedNotification);
                    });

                    // log user's activity
                    Activity.create({
                        _owner: req.user.id,
                        type: 'user-friend-approved',
                        title: updatedFriend.firstName + ' ' + updatedFriend.lastName + "さんの友達リクエストを承認しました。"
                    }, function(err) {
                        if (err) next(err);
                    });
                });
            });
        }
    });
};

decline = function(req, res, next, notification) {

    // find request sender
    User.findById(notification._from, function(err, friend){

        // remove user's id from request sender's invited list
        friend.invited.pull(req.user._id);

        // update request sender
        friend.save(function(err, updatedFriend) {

            // create respond notification
            Notification.create({
                _owner: updatedFriend.id,
                _from: req.user.id,
                type: 'user-friend-declined'
            }, function(err, respond) {

                if (err) next(err);
                else {
                    // populate the respond notification with user's info
                    respond.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                        if(err) next(err);
                        // send real time message
                        sio.sockets.in(updatedFriend.id).emit('user-friend-declined', noty);
                    });
                }
            });

            // mark the notification as confirmed
            notification.result = req.body.result;
            notification.confirmed = true;
            notification.save(function(err, confirmedNotification) {
                if (err) next(err);
                else res.json(confirmedNotification);
            });

            // log user's activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-friend-declined',
                title: updatedFriend.firstName + ' ' + updatedFriend.lastName + "さんの友達リクエストを拒否しました。"
            }, function(err) {
                if (err) next(err);
            });
        });
    });
};

acknowledge = function(req, res, next, notification) {

    // mark the notification as confirmed
    notification.result = req.body.result;
    notification.confirmed = true;
    notification.save(function(err, confirmedNotification) {
        if (err) next(err);
        else res.json(confirmedNotification);
    });
};