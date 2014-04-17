var Mailer = require('../mailer/mailer.js'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// unknow friend list
exports.introduce = function(req, res, next) {

    // page number
    var page = req.query.page || 0;

    // find user that:
    User.find()
        .where('_id')
        .ne(req.user._id)  // not himself
        .nin(req.user.friends.concat(req.user.invited))  // not his friend and haven't been invited by him
        // .nin(req.user.invited)
        .select('type firstName lastName title gender bio photo employments educations createDate')
        .skip(30*page)  // skip n page
        .limit(30)  // 30 user per page
        .sort({createDate:-1})  // sort by createDate desc
        .exec(function(err, users) {
            if (err) next(err);
            else
                // return the user
                res.json(users);
        });
};

// friend list
exports.index = function(req, res, next) {

    // type of request
    var type = req.query.type || null;

    // default to show user's friends
    var friendIdList = req.user.friends;

    // if requested for 'invited' friend
    if (type == "invited") {
        // change the query condition
        friendIdList = req.user.invited;
    }

    // get friends
    User.find()
        .where('_id')
        .in(friendIdList)
        .select('type firstName lastName title photo createDate')
        .exec(function(err, friends) {
            if (err) next(err);
            else res.json(friends);
        });

    // // if requested for 'my' friend
    // if (req.params.user == req.user.id) {


    // } else {

    //     User.findById(req.params.user, function(err, user) {
    //         user.populate('friends', 'type firstName lastName title photo createDate', function(err, populateUser) {
    //             if (err) next(err);
    //             else res.json(populateUser.friends);
    //         });
    //     });
    // }
};

// Create Friend
exports.create = function(req, res, next) {

    // TODO: check friend id is already in the 'friend' or 'invited' list

    // add the friend's id into user's invited list
    req.user.invited.addToSet(req.body._id);

    // update user
    req.user.save(function(err, user) {

        if (err) next(err);
        else {
            // create notification
            Notification.create({
                _owner: [req.body._id],
                _from: user.id,
                type: 'user-friend-invited'
            }, function(err, notification) {

                if (err) next(err);
                else {
                    // populate the notification with request sender's info
                    notification.populate({path:'_from', select: 'firstName lastName photo'}, function(err, noty) {
                        // send real time message
                        if(err) next(err);
                        else sio.sockets.in(req.body._id).emit('user-friend-invited', noty);
                    });

                    // send friend-invitation mail
                    User.findById(req.body._id, 'type firstName lastName title photo email createDate', function(err, target){
                        if (err) next(err);
                        else {

                            // log user's activity
                            Activity.create({
                                _owner: user.id,
                                type: 'user-friend-invited',
                                target: req.body._id
                            }, function(err, activity) {
                                // send back requested user's info
                                if (err) next(err);
                                else res.json(target);
                            });

                            Mailer.friendInvitation({
                                from: user,
                                email: target.email
                            });
                        }
                    });
                }
            });
        }
    });
};

// Remove Friend
exports.remove = function(req, res, next) {

    // remove the friend's id from user's friend list
    req.user.friends.pull(req.params.friend);

    // update user
    req.user.save(function(err, user) {

        if (err) next(err);
        else {

            // find that friend, remove this user from his friend list
            User.findByIdAndUpdate(req.params.friend, {'$pull': {friends: user.id}}, function(err, friend) {

                if (err) next(err);
                else {
                    // create notification
                    Notification.create({
                        _owner: [friend.id],
                        _from: user.id,
                        type: 'user-friend-break'
                    }, function(err, notification) {

                        if (err) next(err);
                        else {
                            // populate the notification with request sender's info
                            notification.populate({path:'_from', select: 'firstName lastName photo'}, function(err, noty) {

                                // send real time message
                                if(err) next(err);
                                else sio.sockets.in(friend.id).emit('user-friend-break', noty);
                            });

                            // log user's activity
                            Activity.create({
                                _owner: user.id,
                                type: 'user-friend-break',
                                target: req.params.friend
                            }, function(err, activity) {
                                // send back requested user's info
                                if (err) next(err);
                                else res.json(friend);
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.suggest = function(req, res, next) {

    var initial = req.query.initial;

    User.find({_id: {'$ne': req.user._id}})
        .or([{firstName: new RegExp(initial, "i")}, {lastName: new RegExp(initial, "i")}])
        .select('firstName lastName bio photo')
        .limit(8)
        .exec(function(err, users) {
            if (err) next(err);
            else
            // return the user
            res.json(users);
        });
};