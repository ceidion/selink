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

/*
    Create a comment

    1. check post commentable flag, return error if uncommentable
    2. find post with its Id
        3. create comment object
        4. add comment object to post's comments list
        5. update post
            if the comment author is not post author
                6. create user activity
                7. create notification for post author
                    8. send real-time notification to post author
                9. send email notification to post author
            10. return comment to client
*/
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

        function sendMessages(post, comment, notification, callback) {

            if (notification) {

                // send real time message
                notification._owner.forEach(function(room) {
                    sio.sockets.in(room).emit('post-commented', {
                        _id: notification.id,
                        _from: comment._owner,
                        type: 'post-commented',
                        targetPost: post,
                        targetComment: comment.id
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
exports.update = function(req, res, next){

    // TODO: check ownership

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            post.comments.id(req.params.comment).set('content', req.body.content);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else res.json(newPost.comments.id(req.params.comment));
            });
        }
    });

};

// Remove comment
exports.remove = function(req, res, next) {

    // TODO: check ownership

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // comment was deleted in this way because I can't find a way to filter the deleted comment when the post are queried,
            // I tried $elemMatch, but it just return the first non-delete comment, not working here.

            // push it to the backup array
            post.removedComments.push(post.comments.id(req.params.comment));

            // pull the removed comment out
            post.comments.pull(req.params.comment);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else res.json(newPost.removedComments.id(req.params.comment));
            });
        }
    });
};

/*
    Like comment

    1. find the post with its Id
        2. find the comment with its Id in post's comments list
        3. add user id to comment's liked list
        4. update post
            if the comment author is not the user
                5. create user activity
                6. create notification for comment author
                    7. send real-time notification to comment author
                8. send email notification to comment author
            9. return the comment to client
*/
exports.like = function(req, res, next){

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // TODO: one user can like a comment only once!

            // add one like on comment
            post.comments.id(req.params.comment).liked.addToSet(req.body.liked);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // if someone not post owner liked this comment
                    if (newPost.comments.id(req.params.comment)._owner != req.user.id) {

                        // create activity
                        Activity.create({
                            _owner: req.body.liked,
                            type: 'comment-liked',
                            targetPost: newPost._id,
                            targetComment: req.params.comment
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost.comments.id(req.params.comment)._owner],
                            _from: req.body.liked,
                            type: 'comment-liked',
                            targetPost: newPost._id,
                            targetComment: req.params.comment
                        }, function(err, notification) {

                            if (err) next(err);
                            else {

                                var notyPopulateQuery = [{
                                    path:'_from',
                                    select: 'type firstName lastName title cover photo createDate'
                                },{
                                    path:'targetPost'
                                }];

                                // populate the respond notification with user's info
                                notification.populate(notyPopulateQuery, function(err, noty) {
                                    if(err) next(err);
                                    // send real time message
                                    sio.sockets.in(newPost.comments.id(req.params.comment)._owner._id).emit('comment-liked', noty);
                                });
                            }
                        });
                    }

                    // populate the comment owner
                    // cause if user reply this comment just after liked it, the owner info is needed.
                    // post don't have this problem (?)
                    User.populate(newPost.comments.id(req.params.comment), {
                        path: '_owner',
                        select: 'type firstName lastName title cover photo createDate'
                    }, function(err, comment) {
                        if(err) next(err);
                        // return the saved post
                        else res.json(comment);
                    });
                }
            });
        }
    });
};