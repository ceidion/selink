var _ = require('underscore'),
    _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    util = require('util'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Post index
exports.index = function(req, res, next) {

    var category = req.query.category || null, // category of request
        group = req.query.group || null,
        user = req.query.user || null,
        page = req.query.page || 0;            // page number

    var query = Post.find();

    // if requested for 'my friends' posts
    if (category == "friend") {
        query.where('_owner').in(req.user.friends);
    // or requested for 'some group' posts
    } else if (group) {
        query.where('group').equals(group);
    // or requested for 'someone\'s'  posts
    } else if (user) {
        query.where('_owner').equals(user);
    // or requested for 'my' posts
    } else {
        query.where('_owner').equals(req.user.id);
    }

    query.where('logicDelete').equals(false)
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .populate('comments._owner', 'type firstName lastName title cover photo createDate')
        .populate('group', 'name cover description')
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
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .populate('comments._owner', 'type firstName lastName title cover photo createDate')
        .populate('group', 'name cover description')
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

/*
    Create post

    1* user = author
    2* group participants = group's participants - author's friends

    1. create post with content and group
        2. create user(author) activity
        3. create notification for author's friends
            4. send real-time notification to author's friends
        5. send email notification to author's friends
        6. create notification for group's participants
            7. sent real-time notification to group's participants
        8. send email notification to group's participants
        9. commit post to solr
        10. return the new post to client
*/
exports.create = function(req, res, next) {

    // create post
    Post.create({
        _owner: req.user.id,
        group: req.body.group,
        content: req.body.content
    }, function(err, newPost) {

        if (err) next(err);
        else {

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'post-new',
                targetPost: newPost._id
            }, function(err, activity) {
                if (err) next(err);
            });

            // send notificaton to all friends
            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'post-new',
                targetPost: newPost._id
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
                        else
                            req.user.friends.forEach(function(room) {
                                sio.sockets.in(room).emit('post-new', noty);
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
                        authorId: req.user.id,
                        authorName: req.user.firstName + ' ' + req.user.lastName,
                        authorPhoto: req.user.photo,
                        content: newPost.content
                    });
                });

            var populateQuery = [{
                path: '_owner',
                select: 'type firstName lastName title cover photo createDate'
            }, {
                path:'group',
                select: 'name cover description'
            }];

            // return the crearted post
            newPost.populate(populateQuery, function(err, post) {
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
                select: 'type firstName lastName title cover photo createDate'
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
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .populate('comments._owner', 'type firstName lastName title cover photo createDate')
        .sort('-createDate')
        .limit(20)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

/*
    Like post

    1. find post with its Id
        2. add user's Id to post's liked list
        3. update post
            if the user is not the post author
                4. create user activity
                5. create notification for post author
                    6. send real-time notification to post author
                7. send email notification to post author
        8. return the post to client
*/
exports.like = function(req, res, next){

    // find post
    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            // TODO: one user can like a post only once!

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
                            type: 'post-liked',
                            targetPost: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost._owner],
                            _from: req.body.liked,
                            type: 'post-liked',
                            targetPost: newPost._id
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
                                    sio.sockets.in(newPost._owner).emit('post-liked', noty);
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

/*
    Bookmark post

    1. find post with its Id
        2. add user's Id to post's bookmarked list
        3. update post
            if the user is not the post author
                4. create user activity
                5. create notification for post author
                    6. send real-time notification to post author
                7. send email notification to post author
        8. return the post to client
*/
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
                            type: 'post-bookmarked',
                            targetPost: newPost._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for post owner
                        Notification.create({
                            _owner: [newPost._owner],
                            _from: req.body.bookmarked,
                            type: 'post-bookmarked',
                            targetPost: newPost._id
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
                                    sio.sockets.in(newPost._owner).emit('post-bookmarked', noty);
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