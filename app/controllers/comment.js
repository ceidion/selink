var _ = require('underscore'),
    _s = require('underscore.string'),
    util = require('util'),
    async = require('async'),
    mongoose = require('mongoose'),
    Mailer = require('../mailer/mailer.js'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

var populateField = {
    '_owner': 'type firstName lastName title cover photo',
    'replyTo': 'type firstName lastName title cover photo'
};

// Create comment
// ---------------------------------------------
// Create new comment, and return it
// ---------------------------------------------
// 1. find post with its Id
// 2. create comment in the post's comments list
// 3. create user activity
// 4. create notification for post owner (and replied user as needed)
// 5. send real-time notification to post owner and replied user
// 6. send email notification to post author and replied user
// 7. return the full representation of the comment to client

exports.create = function(req, res, next) {

    // TODO: check post's forbidden flag, check ownership

    async.waterfall([

        // find the post
        function findPost(callback) {
            Post.findById(req.params.post, callback);
        },

        // create comment
        function createComment(post, callback) {

            var comment = post.comments.create({
                _owner: req.user.id,
                content: req.body.content,
                replyTo: req.body.replyTo
            });

            // add comment to post
            post.comments.push(comment);

            // save the post
            post.save(function(err, post) {
                if (err) callback(err);
                else callback(null, post, comment);
            });
        },

        // create relate information
        function createRelateInfo(post, comment, callback) {

            async.parallel({

                // create activity
                createActivity: function(callback) {

                    Activity.create({
                        _owner: req.user.id,
                        type: 'post-commented',
                        targetPost: post.id,
                        targetComment: comment.id
                    }, callback);
                },

                // create notification for post owner
                createNotification: function(callback) {

                    // determine the notify target
                    var notifyTarget = [];

                    // if the comment owner is not the post owner
                    if (post._owner != req.user.id)
                        // notify the post owner
                        notifyTarget.push(post._owner);

                    // if the comment is reply someone other than the post owner
                    if (req.body.replyTo && req.body.replyTo != post._owner)
                        // notify that person
                        notifyTarget.push(req.body.replyTo);

                    // if there are anyone need to be notified
                    if (notifyTarget.length)
                        Notification.create({
                            _owner: notifyTarget,
                            _from: req.user.id,
                            type: 'post-commented',
                            targetPost: post.id,
                            targetComment: comment.id
                        }, callback);
                    else
                        callback(null);
                }

            }, function(err, results) {

                if (err) callback(err);
                else callback(null, post, comment, results.createNotification);
            });
        },

        // populate embeded info of comment for later use (and return)
        function populateComment(post, comment, notification, callback) {

            var setting = [{
                    path:'_owner',
                    select: populateField['_owner']
                },{
                    path:'replyTo',
                    select: populateField['replyTo']
                }];

            // get the full representation of the comment
            User.populate(comment, setting, function(err, comment) {

                if (err) callback(err);
                else callback(null, post, comment, notification);
            });
        },

        // send messages
        function sendMessages(post, comment, notification, callback) {

            if (notification) {

                // send real time message
                notification._owner.forEach(function(room) {
                    sio.sockets.in(room).emit('post-commented', {
                        _id: notification.id,
                        _from: comment._owner,
                        type: 'post-commented',
                        targetPost: post,
                        targetComment: comment.id,
                        createDate: new Date()
                    });
                });

                // send email
            }

            callback(null, comment);
        }

    ], function(err, comment) {

        if (err) next(err);
        // return the created comment
        else res.json(comment);
    });

};

// Update comment
// ---------------------------------------------
// Update new comment, and return it
// ---------------------------------------------
// 1. find post with its Id
// 2. update comment in the post's comments list
// 3. return the full representation of the comment to client

exports.update = function(req, res, next){

    // TODO: check ownership

    async.waterfall([

        // find the post
        function findPost(callback) {
            Post.findById(req.params.post, callback);
        },

        // update the comment
        function updateComment(post, callback) {

            post.comments.id(req.params.comment).set('content', req.body.content);

            post.save(function(err, post) {
                if (err) callback(err);
                else callback(null, post.comments.id(req.params.comment));
            });
        },

        // populate the comment for return
        function populateComment(comment, callback) {

            // "_owner" was not populated cause we know the owner is the current user
            User.populate(comment, {
                path:'replyTo',
                select: populateField['replyTo']
            }, callback);
        }

    ], function(err, comment) {

        if (err) next(err);
        // return the created comment
        else res.json(comment);
    });
};

// Update comment
// ---------------------------------------------
// Update comment, and return it
// ---------------------------------------------
// 1. find post with its Id
// 2. update comment in the post's comments list
// 3. return the comment to client

exports.remove = function(req, res, next) {

    // TODO: check ownership

    async.waterfall([

        // find the post
        function findPost(callback) {
            Post.findById(req.params.post, callback);
        },

        // remove the comment
        function removeComment(post, callback) {

            // comment was deleted in this way because I can't find a way to filter the deleted comment when the post are queried,
            // I tried $elemMatch, but it just return the first non-delete comment, not working here.

            // push the removed comment to the backup array
            post.removedComments.push(post.comments.id(req.params.comment));
            // pull the removed comment out from comment array
            post.comments.pull(req.params.comment);

            post.save(function(err, post) {
                if (err) callback(err);
                else callback(null, post.comments.id(req.params.comment));
            });
        }

    ], function(err, comment) {

        if (err) next(err);
        // return the created comment
        else res.json(comment);
    });
};

// Like comment
// ---------------------------------------------
// Like or unlike a comment, and return it
// ---------------------------------------------
// 1. find the post with its Id
// 2. find the comment with its Id in post's comments list
// 3. update the "like" (and "liked") field of the comment
// 4. create activity for the people who like the comment (except owner himself)
// 5. create notification for the comment owner when someone like this comment as first time
// 6. send real-time notification to comment owner
// 7. send email notification to comment owner
// 8. return the full representation of the comment to client

exports.like = function(req, res, next){

    async.waterfall([

        // find the post
        function findPost(callback) {
            Post.findById(req.params.post, callback);
        },

        // update the like of comment
        function updateLike(post, callback) {

            // wether this is the first time this user like this comment
            var comment = post.comments.id(req.params.comment),
                isFirstTime = true,
                type = 'comment-liked';

            // if the user exists in the "liked" field
            if (comment.liked.indexOf(req.user.id) >= 0)
                // it's not the first time he/she like it
                isFirstTime = false;
            else
                // it is the first time, save the user's id in "liked" field
                comment.liked.push(req.user.id);

            // if the user already liked this comment
            if (comment.like.indexOf(req.user.id) >= 0) {
                // unlike it
                comment.like.pull(req.user.id);
                type = 'comment-unliked';
            }
            else
                // like it
                comment.like.push(req.user.id);

            // update the post (comment)
            post.save(function(err, post) {
                if (err) callback(err);
                else callback(null, post, comment, type, isFirstTime);
            });
        },

        // create related information
        function createRelateInfo(post, comment, type, isFirstTime, callback) {

            async.parallel({

                // create activity
                createActivity: function(callback) {

                    // only for the people other than comment owner
                    if (comment._owner != req.user.id)
                        Activity.create({
                            _owner: req.user.id,
                            type: type,
                            targetPost: req.params.post,
                            targetComment: req.params.comment
                        }, callback);
                    else
                        callback(null);
                },

                // create notification for comment owner
                createNotification: function(callback) {

                    // only in the firstTime other people like this comment
                    if (type === 'comment-liked' && isFirstTime && comment._owner != req.user.id)
                        Notification.create({
                            _owner: comment._owner,
                            _from: req.user.id,
                            type: type,
                            targetPost: req.params.post,
                            targetComment: req.params.comment
                        }, callback);
                    else
                        callback(null);
                }

            }, function(err, results) {

                if (err) callback(err);
                else callback(null, post, comment, results.createNotification);
            });
        },

        // populate embeded info of comment for later use (and return)
        function populateComment(post, comment, notification, callback) {

            var setting = [{
                    path:'_owner',
                    select: populateField['_owner']
                },{
                    path:'replyTo',
                    select: populateField['replyTo']
                }];

            // get the full representation of the comment
            User.populate(comment, setting, function(err, comment) {

                if (err) callback(err);
                else callback(null, post, comment, notification);
            });
        },

        // send messages
        function sendMessages(post, comment, notification, callback) {

            if (notification) {

                // send real time message
                sio.sockets.in(comment._owner._id).emit('comment-liked', {
                    _id: notification.id,
                    _from: {
                        _id: req.user.id,
                        type: req.user.type,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        title: req.user.title,
                        cover: req.user.cover,
                        photo: req.user.photo
                    },
                    type: 'comment-liked',
                    targetPost: post,
                    targetComment: req.params.comment,
                    createDate: new Date()
                });

                // send email
            }

            callback(null, comment);
        }

    ], function(err, comment) {

        if (err) next(err);
        // return the liked comment
        else res.json(comment);
    });

};