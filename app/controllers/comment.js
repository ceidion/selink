var _ = require('underscore'),
    _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    util = require('util'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Create a comment
exports.create = function(req, res, next) {

    // TODO: check post's forbidden flag, check ownership

    // find the post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // create a comment object
            var comment = post.comments.create({
                _owner: req.user.id,
                content: req.body.content,
            });

            // add comment to post
            post.comments.push(comment);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // if someone not post owner commented this post
                    if (newPost._owner != req.user.id) {

                        // create activity
                        Activity.create({
                            _owner: req.user.id,
                            type: 'user-post-commented',
                            target: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost._owner],
                            _from: req.user.id,
                            type: 'user-post-commented',
                            target: newPost._id
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
                                    sio.sockets.in(newPost._owner).emit('user-post-commented', noty);
                                });
                            }
                        });
                    }

                    // populate the comment owner and send saved post back
                    User.populate(comment, {
                        path: '_owner',
                        select: 'type firstName lastName title cover photo createDate'
                    }, function(err, newComment) {
                        if (err) next(err);
                        else res.json(newComment);
                    });

                }
            });
        }
    });
};

// Update comment
exports.update = function(req, res, next){

    // TODO: check ownership

    // find the post and update it
    Post.findByIdAndUpdate(req.params.post, req.body, function(err, post) {

        if (err) next(err);
        else {

            post.populate({
                path: '_owner',
                select: 'type firstName lastName title cover photo createDate'
            }, function(err, result){
                if (err) next(err);
                else res.json(result);
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
            // pull the removed comment out
            var remove = post.comments.pull(req.params.comment);
            // push it to the backup array
            post.removedComments.push(remove[0]);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else res.json(newPost);
            });
        }
    });
};

// Like comment
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
                            type: 'user-comment-liked',
                            target: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost.comments.id(req.params.comment)._owner],
                            _from: req.body.liked,
                            type: 'user-comment-liked',
                            target: newPost._id
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
                                    sio.sockets.in(newPost.comments.id(req.params.comment)._owner).emit('user-comment-liked', noty);
                                });
                            }
                        });
                    }

                    // return the saved post
                    res.json(newPost.comments.id(req.params.comment));
                }
            });
        }
    });
};