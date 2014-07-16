var _ = require('underscore'),
    _s = require('underscore.string'),
    Mailer = require('../mailer/mailer.js'),
    util = require('util'),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

var populateField = {
    '_owner': 'type firstName lastName title cover photo',
    'comments._owner': 'type firstName lastName title cover photo',
    'group': 'name cover description'
};

// Post index
// ---------------------------------------------
// Return a list of posts in descending order of create date, without populate any embeded fields.
// In the case of get some user's posts list, user id must passed by the route: '/users/:user/posts'
// In the case of get some group's posts list, group id must passed by the route: '/groups/:group/posts'
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. user  : The user's id of posts list blong to, passed by url  default: none
//   3. group : The group's id of posts list blong to, passed by url default: none
//   4. embed : Comma separate embeded fields for populate           default: none
//   5. sort  : Fields name used for sort                            default: createDate
//   6. page  : page number for pagination                           default: none
//   7. per_page: record number of every page                        default: none
// ---------------------------------------------

exports.index = function(req, res, next) {

    // TODO: check parameters

    // if the request was get some specific user's posts list
    // we need to find the user from users collection first

    // if the specified user is current user
    if (req.params.user && req.params.user === req.user.id) {

        // pass current user to internal method
        _post_index(req, res, req.user, null, next);

    // if specified someone else
    } else if (req.params.user) {

        // get the user's posts info (post ids)
        User.findById(req.params.user, 'posts', function(err, uesr) {
            // pass the user to internal method
            if (err) next(err);
            else _post_index(req, res, uesr, null, next);
        });

    // if specified some group
    } else if (req.params.group) {

        // get the group's posts info (post ids)
        Group.findById(req.params.group, 'posts', function(err, group) {
            // pass the group to internal method
            if (err) next(err);
            else _post_index(req, res, null, group, next);
        });

    } else {

        // neither specified user nor group, pass null to internal method
        _post_index(req, res, null, null, next);
    }
};

// internal method for index
_post_index = function(req, res, user, group, next) {

    // create query
    var query = Post.find();

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified user
    if (user)
        query.where('_id').in(user.posts);

    // if request specified group
    if (group)
        query.where('_id').in(group.posts);

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {
            query.populate(field, populateField[field]);
        });
    }

    // if request specified sort order
    if (req.query.sort)
        query.sort(req.query.sort);
    else
        query.sort('-createDate');

    // if request specified pagination
    if (req.query.page && req.query.per_page)
        query.skip(req.query.page*req.query.per_page).limit(req.query.per_page);

    query.where('logicDelete').equals(false)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Post index -- friends' posts
// ---------------------------------------------
// Return a list of posts that posted by user's friends, in descending order of create date, 
// without populate any embeded fields. This is short cut method.
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. embed : Comma separate embeded fields for populate           default: none
//   3. sort  : Fields name used for sort                            default: createDate
//   4. page  : page number for pagination                           default: none
//   5. per_page: record number of every page                        default: none
// ---------------------------------------------

exports.friendsIndex = function(req, res, next) {

    // create query
    var query = Post.find();

    // query posts belong to current user's friends
    query.where('_owner').in(req.user.friends);

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {
            query.populate(field, populateField[field]);
        });
    }

    // if request specified sort order
    if (req.query.sort)
        query.sort(req.query.sort);
    else
        query.sort('-createDate');

    // if request specified pagination
    if (req.query.page && req.query.per_page)
        query.skip(req.query.page*req.query.per_page).limit(req.query.per_page);

    query.where('logicDelete').equals(false)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Post index -- groups' posts
// ---------------------------------------------
// Return a list of posts that posted in the user's groups, in descending order of create date, 
// without populate any embeded fields. This is short cut method.
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. embed : Comma separate embeded fields for populate           default: none
//   3. sort  : Fields name used for sort                            default: createDate
//   4. page  : page number for pagination                           default: none
//   5. per_page: record number of every page                        default: none
// ---------------------------------------------

exports.groupsIndex = function(req, res, next) {

    // create query
    var query = Post.find();

    // query posts belong to current user's groups
    query.where('group').in(req.user.groups);

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {
            query.populate(field, populateField[field]);
        });
    }

    // if request specified sort order
    if (req.query.sort)
        query.sort(req.query.sort);
    else
        query.sort('-createDate');

    // if request specified pagination
    if (req.query.page && req.query.per_page)
        query.skip(req.query.page*req.query.per_page).limit(req.query.per_page);

    query.where('logicDelete').equals(false)
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


// Create post
// ---------------------------------------------
// Create new post, and return the newly created post
//   1. current user = author
//   2. group participants = group's participants - author's friends - author himself
// ---------------------------------------------
// 1. create post with content and group
//   2. save the post pointer in author profile
//   3. save the post pointer in group profile
//   4. create author activity
//   5. create notification for author's friends
//     6. send real-time notification to author's friends
//   7. send email notification to author's friends
//   8. create notification for group's participants
//     9. sent real-time notification to group's participants
//   10. send email notification to group's participants
//   11. commit post to solr
//   12. return the new post to client

exports.create = function(req, res, next) {

    // create post
    Post.create({
        _owner: req.user.id,
        group: req.body.group,
        content: req.body.content
    }, function(err, newPost) {

        if (err) next(err);
        else {

            // save the post id in user profile
            req.user.posts.addToSet(newPost._id);
            req.user.save(function(err) {
                if (err) next(err);
            });

            // if the post belong to some group
            if (req.body.group)
                // save the post id in group profile
                Group.findByIdAndUpdate(req.body.group, {$addToSet: {posts: newPost._id}}, function(err, group) {
                    if (err) next(err);
                    else {

                        // send email to all group member (that not friend and himself)
                        User.find()
                            .select('email')
                            .where('_id').in(group.participants).nin(req.user.friends).ne(req.user.id)
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
                    }
                });

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
                        select: populateField['_owner']
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

            // index this post in solr
            solr.add(newPost.toSolr(), function(err, solrResult) {
                if (err) next(err);
                else {

                    solr.commit(function(err, res) {
                        if(err) console.log(err);
                        if(res) console.log(res);
                    });
                }
            });

            var populateQuery = [{
                path: '_owner',
                select: populateField['_owner']
            }, {
                path:'group',
                select: populateField['group']
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
    // TODO: if this post was removed, what to do with the activites and notifications relate on it? and comments, bookmarks?

    // find the post and mark it as logical deleted
    Post.findByIdAndUpdate(req.params.post, {logicDelete: true}, function(err, post) {
        if (err) next(err);
        else {

            // remove the post id from user profile
            req.user.posts.pull(post._id);
            req.user.save(function(err) {
                if (err) next(err);
            });

            // if this post belong to some group
            if (post.group)
                // remove it from group profile
                Group.findByIdAndUpdate(post.group, {$pull: {posts: post._id}}, function(err) {
                    if (err) next(err);
                });

            // remove this post in solr
            solr.delete('id', post.id, function(err, solrResult) {
                if (err) next(err);
                else {
                    solr.commit(function(err,res){
                       if(err) console.log(err);
                       if(res) console.log(res);
                    });
                }
            });

            res.json(post);
        }
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