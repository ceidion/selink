var mongoose = require('mongoose'),
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
        .nin(req.user.friends)  // not his friend
        .nin(req.user.invited)  // haven't been invited by him
        .select('type firstName lastName title gender bio photo createDate')
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
    if (type == "requested") {
        // change the query condition
        friendIdList = req.user.invited;
    }

    // get friends
    User.find()
        .where('_id')
        .in(friendIdList)
        .select('_id firstName lastName photo')
        .exec(function(err, friends) {
            if (err) next(err);
            else
                res.json(friends);
        });
};

// send new friend request
exports.create = function(req, res, next) {

    // add the friend's id into user's invited list
    req.user.invited.addToSet(req.body.friendId);

    // update user
    req.user.save(function(err, user) {

        if (err) next(err);
        else {

            // find the requested user
            User.findById(req.body.friendId, function(err, friend) {

                if (err) next(err);
                else {
                    // create notification
                    Notification.create({
                        _owner: friend.id,
                        _from: user.id,
                        type: 'user-friend-invited'
                    }, function(err, notification) {

                        if (err) next(err);
                        else {
                            // populate the notification with request sender's info
                            notification.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                                if(err) next(err);
                                // send real time message
                                sio.sockets.in(friend.id).emit('user-friend-invited', noty);
                            });

                            // log user's activity
                            Activity.create({
                                _owner: user.id,
                                type: 'user-friend-invited',
                                title: friend.firstName + ' ' + friend.lastName + "さんに友達リクエストを送りました。"
                            }, function(err, activity) {

                                if (err) next(err);
                                // send back requested user's info
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