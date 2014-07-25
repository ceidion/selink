var _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

var populateField = {};

// Connection list
// ---------------------------------------------
// Return a list of 20 people that have specific connection with user in descending order of create date.
// In the case of get some user's connections, user id must passed by the route: '/users/:user/connection'
// ---------------------------------------------
// Parameter:
//   1. user  : The user's id of posts list blong to, passed by url                          default: current user
//   2. type  : The type of connection, identified by the path of request                    default: friends
//              a. friends    -- the people are user's friends
//              b. invited    -- the people that user had invited as friend
//              c. nonfriends -- the people are not user's friends (include invited)
//              d. discover   -- the people that user completely unknow (exclude invited)
//   3. before: A Unix time stamp used as start point of retrive                             default: none
// ---------------------------------------------

exports.index = function(req, res, next) {

    // TODO: check parameters

    // if the request was get some specific user's connections
    // we need to get the user from users collection

    // if specified someone not current user
    if (req.params.user && req.params.user !== req.user.id) {

        // get the user's connections (user ids)
        User.findById(req.params.user, 'friends invited', function(err, uesr) {
            // pass the user to internal method
            if (err) next(err);
            else _connection_index(req, res, uesr, next);
        });

    } else {

        // no specified user, pass current user to internal method
        _connection_index(req, res, req.user, next);
    }

};

// internal method for index
_connection_index = function(req, res, user, next) {

    // create query
    var query = User.find();

    // if request "invited" connection type
    if (_s.endsWith(req.path, "/invited"))
        query.where('_id').in(user.invited);

    // if request "nonfriends" connection type
    else if (_s.endsWith(req.path, "/nonfriends"))
        query.where('_id').ne(user._id).nin(user.friends);

    // if request "discover" connection type
    else if (_s.endsWith(req.path, "/discover"))
        query.where('_id').ne(user._id).nin(user.friends.concat(user.invited));

    // defaultly, find "friends"
    else
        query.where('_id').in(user.friends);

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    query.select('type firstName lastName title cover bio photo employments educations createDate')
        .where('logicDelete').equals(false)
        .limit(20)
        .sort('-createDate')
        .exec(function(err, users) {
            if (err) next(err);
            else if (users.length === 0) res.json(404, {});
            else res.json(users);
        });

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
                type: 'friend-invited'
            }, function(err, notification) {

                if (err) next(err);
                else {
                    // populate the notification with request sender's info
                    notification.populate({path:'_from', select: 'type firstName lastName title cover photo email createDate'}, function(err, noty) {
                        // send real time message
                        if(err) next(err);
                        else sio.sockets.in(req.body._id).emit('friend-invited', noty);
                    });

                    // send friend-invitation mail
                    User.findById(req.body._id, 'type firstName lastName title cover photo email createDate', function(err, target){
                        if (err) next(err);
                        else {

                            // log user's activity
                            Activity.create({
                                _owner: user.id,
                                type: 'friend-invited',
                                targetUser: req.body._id
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
                        type: 'friend-break'
                    }, function(err, notification) {

                        if (err) next(err);
                        else {
                            // populate the notification with request sender's info
                            notification.populate({path:'_from', select: 'firstName lastName photo'}, function(err, noty) {

                                // send real time message
                                if(err) next(err);
                                else sio.sockets.in(friend.id).emit('friend-break', noty);
                            });

                            // log user's activity
                            Activity.create({
                                _owner: user.id,
                                type: 'friend-break',
                                targetUser: req.params.friend
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