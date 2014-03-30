var _ = require('underscore'),
    S = require('string'),
    request = require('request'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Post index
exports.index = function(req, res, next) {

    // category of request
    var category = req.query.category || null,
        // page number
        page = req.query.page || 0;

    var query = Post.find();

    // if requested for 'my friends' posts
    if (category == "friend") {
        query.where('_owner').in(req.user.friends);
    // or requested for "someone's" posts
    } else {
        query.where('_owner').equals(req.params.user);
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

// Create post
exports.create = function(req, res, next) {

    // create post
    Post.create({
        _owner: req.user.id,
        content: req.body.content,
    }, function(err, newPost) {
        if (err) next(err);
        else {

            // strip out the tags in content
            var contentStripTag = S(req.body.content).stripTags();

            // if content is longer than 150
            if (contentStripTag.length > 150) {
                // cut it in 150
                contentStripTag = contentStripTag.truncate(150).s;
            }

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-post',
                title: "新しい記事を投稿しました。",
                content: contentStripTag,
                link: 'user/' + req.params.id + '/posts/' + newPost._id
            }, function(err, activity) {
                if (err) next(err);
            });

            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'user-post',
                content: contentStripTag
            }, function(err, notification) {
                if (err) next(err);
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

exports.remove = function(req, res, next) {

    // TODO: check post's ownership

    Post.findByIdAndUpdate(req.params.post, {logicDelete: true}, function(err, post) {
        if (err) next(err);
        else res.json(post);
    });
};

exports.update = function(req, res, next){

    // TODO: check post's ownership

    Post.findByIdAndUpdate(req.params.post, req.body, function(err, post) {
        if (err) next(err);
        else {
            post.populate({path: '_owner', select: 'firstName lastName photo'}, function(err, result){
                if (err) next(err)
                else res.json(result);
            });
        }
    });
};

// Get post (for home)
exports.home = function(req, res, next) {

    Post.find()
        .where('logicDelete').equals(false)
        .populate('_owner', 'firstName lastName photo')
        .populate('comments._owner', 'firstName lastName photo')
        .sort('-createDate')
        // .limit(20)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

exports.like = function(req, res, next){

    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {
            post.liked.addToSet(req.body.liked);
            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // create activity
                    Activity.create({
                        _owner: req.body.liked,
                        type: 'user-post-liked',
                        title: "いいね！しました。",
                        link: 'user/' + newPost._owner + '/posts/' + newPost._id
                    }, function(err, activity) {
                        if (err) next(err);
                    });

                    // create notification for post owner
                    Notification.create({
                        _owner: [newPost._owner],
                        _from: req.body.liked,
                        type: 'user-post-liked'
                    }, function(err, notification) {

                        if (err) next(err);
                        else {
                            // populate the respond notification with user's info
                            notification.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                                if(err) next(err);
                                // send real time message
                                sio.sockets.in(newPost._owner).emit('user-post-liked', noty);
                            });
                        }
                    });

                    res.json(newPost);
                }
            });
        }
    });
};

exports.comment = function(req, res, next) {

    // TODO: check post's forbidden flag

    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {

            var comment = post.comments.create(req.body);

            post.comments.push(comment);

            post.save(function(err, newPost) {

                if (err) next(err);
                else {

                    // create activity
                    Activity.create({
                        _owner: req.body._owner,
                        type: 'user-post-commented',
                        title: "コメントしました。",
                        link: 'user/' + newPost._owner + '/posts/' + newPost._id
                    }, function(err, activity) {
                        if (err) next(err);
                    });

                    // create notification for post owner
                    Notification.create({
                        _owner: [newPost._owner],
                        _from: req.body._owner,
                        type: 'user-post-commented'
                    }, function(err, notification) {

                        if (err) next(err);
                        else {
                            // populate the respond notification with user's info
                            notification.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                                if(err) next(err);
                                // send real time message
                                sio.sockets.in(newPost._owner).emit('user-post-commented', noty);
                            });
                        }
                    });

                    User.populate(comment, {path: '_owner', select: '_id firstName lastName photo'}, function(err, newComment) {

                        if (err) next(err);
                        else res.json(newComment);
                    });

                }
            });
        }
    });
};