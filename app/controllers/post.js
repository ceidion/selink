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
    var category = req.query.category || null;

    var query = Post.find();

    // if requested for 'my friends' posts
    if (category == "friend") {

        query.where('_owner').in(req.user.friends);
        query.populate('_owner', 'firstName lastName photo');

    // if requested for 'my' posts
    } else if (req.params.user == req.user.id){

        // not populate owner, cause client have
        query.where('_owner').equals(req.user.id);

    // or requested for "someone's" posts
    } else {

        query.where('_owner').equals(req.params.user);
        query.populate('_owner', 'firstName lastName photo');
    }

    query.sort('-createDate')
        // .limit(20)
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

exports.liked = function(req, res, next){

    Post.findById(req.params.post, function(err, post) {

        if (err) next(err);
        else {
            post.liked.addToSet(req.body.id);
            post.save(function(err, newPost) {

                if (err) next(err);
                else res.json(newPost);
            });
        }
    });
};