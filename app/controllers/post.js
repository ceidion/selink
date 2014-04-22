var _ = require('underscore'),
    _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    request = require('request'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Post index
exports.index = function(req, res, next) {

    var category = req.query.category || null, // category of request
        user = req.query.user || null,
        page = req.query.page || 0;            // page number

    var query = Post.find();

    // if requested for 'my friends' posts
    if (category == "friend") {
        query.where('_owner').in(req.user.friends);
    // or requested for 'someone' posts
    } else if (user) {
        query.where('_owner').equals(user);
    // or requested for 'my' posts
    } else {
        query.where('_owner').equals(req.user.id);
    }

    query.where('logicDelete').equals(false)
        .populate('_owner', 'firstName lastName photo')
        .populate('comments._owner', 'firstName lastName photo')
        .skip(20*page)  // skip n page
        .limit(20)
        .sort('-createDate')
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Show single post
exports.show = function(req, res, next) {

    Post.findById(req.params.post)
        .where('logicDelete').equals(false)
        .populate('_owner', 'firstName lastName photo')
        .populate('comments._owner', 'firstName lastName photo')
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Create post
exports.create = function(req, res, next) {

    // strip out the tags in content
    var contentStripTag = _s.stripTags(req.body.content);

    // if content is longer than 350
    if (contentStripTag.length > 350) {
        // cut it in 350
        contentStripTag = _s.truncate(contentStripTag, 350);
    }

    // create post
    Post.create({
        _owner: req.user.id,
        content: req.body.content,
        summary: contentStripTag
    }, function(err, newPost) {

        if (err) next(err);
        else {

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-post',
                target: newPost._id
            }, function(err, activity) {
                if (err) next(err);
            });

            // send notificaton to all friends
            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'user-post',
                target: newPost._id
            }, function(err, notification) {
                if (err) next(err)
                else {
                    // populate the respond notification with user's info
                    notification.populate({
                        path:'_from',
                        select: 'firstName lastName photo'
                    }, function(err, noty) {
                        if(err) next(err);
                        // send real time message
                        else 
                            req.user.friends.forEach(function(room) {
                                sio.sockets.in(room).emit('user-post', noty);
                            });
                    });
                }
            });

            // send email to all friends
            User.find()
                .select('email')
                .where('_id').in(req.user.friends)
                .where('logicDelete').equals(false)
                .exec(function(err, users) {
                    // send new-post mail
                    Mailer.newPost(users, {
                        _id: newPost._id,
                        authorName: req.user.firstName + ' ' + req.user.lastName,
                        authorPhoto: req.user.photo,
                        summary: newPost.summary
                    });
                });

            // return the crearted post
            newPost.populate({
                path: '_owner',
                select: 'firstName lastName photo'
            }, function(err, post) {
                if (err) next(err);
                else res.json(post);
            });
        }
    });
};

// Update post
exports.update = function(req, res, next){

    // TODO: check post's ownership

    // find the post and update it
    Post.findByIdAndUpdate(req.params.post, req.body, function(err, post) {

        if (err) next(err);
        else {

            post.populate({
                path: '_owner',
                select: 'firstName lastName photo'
            }, function(err, result){
                if (err) next(err);
                else res.json(result);
            });
        }
    });
};

// Remove post
exports.remove = function(req, res, next) {

    // TODO: check post's ownership

    // find the post and mark it as logical deleted
    Post.findByIdAndUpdate(req.params.post, {logicDelete: true}, function(err, post) {
        if (err) next(err);
        else res.json(post);
    });
};

// Get latest post
exports.news = function(req, res, next) {

    Post.find()
        .where('logicDelete').equals(false)
        .populate('_owner', 'firstName lastName photo')
        .populate('comments._owner', 'firstName lastName photo')
        .sort('-createDate')
        .limit(20)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Like post
exports.like = function(req, res, next){

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // add one like
            post.liked.addToSet(req.body.liked);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // if someone not post owner liked this post
                    if (newPost._owner != req.user.id) {

                        // create activity
                        Activity.create({
                            _owner: req.body.liked,
                            type: 'user-post-liked',
                            target: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost._owner],
                            _from: req.body.liked,
                            type: 'user-post-liked',
                            target: newPost._id
                        }, function(err, notification) {

                            if (err) next(err);
                            else {
                                // populate the respond notification with user's info
                                notification.populate({
                                    path:'_from',
                                    select: 'firstName lastName photo'
                                }, function(err, noty) {
                                    if(err) next(err);
                                    // send real time message
                                    sio.sockets.in(newPost._owner).emit('user-post-liked', noty);
                                });
                            }
                        });
                    }

                    // return the saved post
                    res.json(newPost);
                }
            });
        }
    });
};

// bookmark post
exports.bookmark = function(req, res, next){

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // add one bookmarked people id
            post.bookmarked.addToSet(req.body.bookmarked);

            // save the post
            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // if someone not post owner bookmarked this post
                    if (newPost._owner != req.user.id) {

                        // create activity
                        Activity.create({
                            _owner: req.body.bookmarked,
                            type: 'user-post-bookmarked',
                            target: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost._owner],
                            _from: req.body.bookmarked,
                            type: 'user-post-bookmarked',
                            target: newPost._id
                        }, function(err, notification) {

                            if (err) next(err);
                            else {
                                // populate the respond notification with user's info
                                notification.populate({
                                    path:'_from',
                                    select: 'firstName lastName photo'
                                }, function(err, noty) {
                                    if(err) next(err);
                                    // send real time message
                                    sio.sockets.in(newPost._owner).emit('user-post-bookmarked', noty);
                                });
                            }
                        });
                    }

                    // return the saved post
                    res.json(newPost);
                }
            });
        }
    });
};

// Comment a post
exports.comment = function(req, res, next) {

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
                                    select: 'firstName lastName photo'
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
                        select: 'firstName lastName photo'
                    }, function(err, newComment) {
                        if (err) next(err);
                        else res.json(newComment);
                    });

                }
            });
        }
    });
};