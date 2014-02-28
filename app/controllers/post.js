var _ = require('underscore'),
    S = require('string'),
    request = require('request'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity');

// Post index
exports.index = function(req, res, next) {

    if (req.params.id) {

        Post.find({_owner: req.params.id})
            .sort('-createDate')
            .limit(20)
            .populate('_owner', 'firstName lastName photo')
            .exec(function(err, posts) {
                if (err) next(err);
                else res.json(posts);
            });

    } else {

        Post.find()
            .sort('-createDate')
            .limit(20)
            .populate('_owner', 'firstName lastName photo')
            .exec(function(err, posts) {
                if (err) next(err);
                else res.json(posts);
            });
    }
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