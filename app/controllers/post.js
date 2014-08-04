var _ = require('underscore'),
    _s = require('underscore.string'),
    util = require('util'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    Mailer = require('../mailer/mailer.js'),
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
// Return latest 20 posts of current user in descending order of create date.
// In the case of get other user's posts list, user id must passed by the route: '/users/:user/posts'
// In the case of get some group's posts list, group id must passed by the route: '/groups/:group/posts'
// ---------------------------------------------
// Parameter:
//   1. user  : The user's id of posts list belong to, passed by url   default: current uer
//   2. group : The group's id of posts list belong to, passed by url  default: none
//   3. before: A Unix time stamp used as start point of retrive       default: none
//   4. size  : Number of result to return                             default: 20
// ---------------------------------------------

exports.index = function(req, res, next) {

    // TODO: check parameters

    // if the request was get some specific user's posts list
    // we need to find the user from users collection first

    // if specified someone else
    if (req.params.user && req.params.user !== req.user.id) {

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

        // default to current user
        _post_index(req, res, req.user, null, next);
    }
};

// internal method for index
_post_index = function(req, res, user, group, next) {

    // create query
    var query = Post.find();

    // if request specified user, populate the group.
    // cause the client should have the _owner, so we don't populate _owner
    if (user)
        query.where('_id').in(user.posts)
            .populate('group', populateField['group']);

    // if request specified group, populate the _owner
    // cause the client should have the group, so we don't populate group
    if (group)
        query.where('_id').in(group.posts)
            .populate('_owner', populateField['_owner']);

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    // default query parameter below
    query.select('-removedComments -logicDelete')
        .populate('comments._owner', populateField['comments._owner'])
        .where('logicDelete').equals(false)
        .limit(req.query.size || 20)
        .sort('-createDate')
        .exec(function(err, posts) {
            if (err) next(err);
            else if (posts.length === 0) res.json(404, {});
            else res.json(posts);
        });
};

// NewsFeed
// ---------------------------------------------
// Return the latest 20 posts of current user's friends and groups, in descending order of create date.
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. embed : Comma separate embeded fields for populate           default: none
//   3. sort  : Fields name used for sort                            default: createDate
//   4. before: A Unix time stamp used as start point of retrive     default: none
//   5. size  : record number of query                               default: 20
// ---------------------------------------------

exports.newsfeed = function(req, res, next) {

    // create query
    var query = Post.find();

    // query posts belong to current user and his/her friends and groups
    query.or([
        {_owner: req.user.id},
        {_owner: {$in: req.user.friends}},
        {group: {$in: req.user.groups}}
    ]);

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {

            if (populateField[field])
                query.populate(field, populateField[field]);
            else
                query.populate(field);
        });
    }

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    // if request specified sort order and pagination
    var sort = req.query.sort || '-createDate',
        size = req.query.size || 20;

    query.where('logicDelete').equals(false)
        .limit(size)
        .sort(sort)
        .exec(function(err, posts) {
            if (err) next(err);
            else if (posts.length === 0) res.json(404, {});
            else res.json(posts);
        });
};

// Post index -- friends' posts
// ---------------------------------------------
// Return a list 20 of posts that posted by user's friends, in descending order of create date,.
// This is short cut method and always relate to current user.
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. embed : Comma separate embeded fields for populate           default: none
//   3. sort  : Fields name used for sort                            default: createDate
//   4. page  : page number for pagination                           default: 0
//   5. per_page: record number of every page                        default: 20
// ---------------------------------------------

// exports.friendsIndex = function(req, res, next) {

//     // create query
//     var query = Post.find();

//     // query posts belong to current user's friends
//     query.where('_owner').in(req.user.friends);

//     // if request specified output fields
//     if (req.query.fields)
//         query.select(req.query.fields.replace(/,/g, ' '));

//     // if request specified population
//     if (req.query.embed) {
//         req.query.embed.split(',').forEach(function(field) {
//             query.populate(field, populateField[field]);
//         });
//     }

//     // if request specified sort order and pagination
//     var sort = req.query.sort || '-createDate',
//         page = req.query.page || 0,
//         per_page = req.query.per_page || 20;

//     query.where('logicDelete').equals(false)
//         .skip(page*per_page)
//         .limit(per_page)
//         .sort(sort)
//         .exec(function(err, posts) {
//             if (err) next(err);
//             else res.json(posts);
//         });
// };

// Post index -- groups' posts
// ---------------------------------------------
// Return a list 20 of posts that posted in the user's groups, in descending order of create date.
// This is short cut method and always relate to current user.
// ---------------------------------------------
// Parameter:
//   1. fields: Comma separate select fields for output              default: none
//   2. embed : Comma separate embeded fields for populate           default: none
//   3. sort  : Fields name used for sort                            default: createDate
//   4. page  : page number for pagination                           default: 0
//   5. per_page: record number of every page                        default: 20
// ---------------------------------------------

// exports.groupsIndex = function(req, res, next) {

//     // create query
//     var query = Post.find();

//     // query posts belong to current user's groups
//     query.where('group').in(req.user.groups);

//     // if request specified output fields
//     if (req.query.fields)
//         query.select(req.query.fields.replace(/,/g, ' '));

//     // if request specified population
//     if (req.query.embed) {
//         req.query.embed.split(',').forEach(function(field) {
//             query.populate(field, populateField[field]);
//         });
//     }

//     // if request specified sort order and pagination
//     var sort = req.query.sort || '-createDate',
//         page = req.query.page || 0,
//         per_page = req.query.per_page || 20;

//     query.where('logicDelete').equals(false)
//         .skip(page*per_page)
//         .limit(per_page)
//         .sort(sort)
//         .exec(function(err, posts) {
//             if (err) next(err);
//             else res.json(posts);
//         });
// };

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

    async.waterfall([

        // create post
        function createPost(callback) {

            Post.create({
                _owner: req.user.id,
                group: req.body.group,
                content: req.body.content
            }, callback);
        },

        // after post created
        function afterProcess(post, callback) {

            async.parallel({

                // save the post id in user profile
                updateUser: function(callback) {
                    req.user.posts.addToSet(post._id);
                    req.user.save(callback);
                },

                // save the post id in group profile
                updateGroup: function(callback) {

                    if (req.body.group)
                        // save the post id in group profile
                        Group.findByIdAndUpdate(req.body.group, {$addToSet: {posts: post._id}}, callback);
                    else
                        callback(null);
                },

                // create activity
                createActivity: function(callback) {

                    Activity.create({
                        _owner: req.user.id,
                        type: 'post-new',
                        targetPost: post._id
                    }, callback);
                },

                // send notificaton to all friends
                createNotification: function(callback) {

                    Notification.create({
                        _owner: req.user.friends,
                        _from: req.user.id,
                        type: 'post-new',
                        targetPost: post._id
                    }, callback);
                },

                // index this post in solr
                createSolr: function(callback) {

                    solr.add(post.toSolr(), function(err, result) {
                        if (err) callback(err);
                        else
                            solr.commit(function(err, result) {
                                if(err) callback(err);
                                else callback(null, result);
                            });
                    });
                }

            }, function(err, results) {

                if (err) callback(err);
                else {

                    var postObj = post.toObject(),
                        group = results.updateGroup,
                        notification = results.createNotification,
                        notifiedUser = req.user.friends,
                        owner = {
                            _id: req.user._id,
                            type: req.user.type,
                            firstName: req.user.firstName,
                            lastName: req.user.lastName,
                            title: req.user.title,
                            cover: req.user.cover,
                            photo: req.user.photo
                        };

                    // manually populate post owner
                    postObj._owner = owner;

                    // if the post belong to some group
                    if (group) {
                        // manually populate post group (as needed)
                        postObj.group = {
                            _id: group._id,
                            name: group.name,
                            cover: group.cover,
                            description: group.description
                        };

                        // --------- this is NOT working :---------------
                        // notifiedUser = _.union(req.user.friends, _.without(group.participants, req.user.id));
                        // ----------------- Because :-------------------
                        // intersection uses simple reference equality to compare the elements, rather than comparing their contents.
                        // To compare two ObjectIds for equality you need to use the ObjectId.equals method.
                        // So the simplest solution would be to convert the arrays to strings so that intersection will work.
                        // ----------------------------------------------

                        // change the notification receiver to group members + friends
                        group.participants.forEach(function(participant) {
                            // note that I use user's '_id', cause the participant is an ObjectId (object).
                            // remember that the 'id' is the string representation of '_id'
                            if (!_.isEqual(participant, req.user._id))
                                notifiedUser.addToSet(participant);
                        });
                    }

                    // send real time message to friends
                    notifiedUser.forEach(function(room) {
                        sio.sockets.in(room).emit('post-new', {
                            _id: notification._id,
                            _from: owner,
                            targetPost: postObj,
                            type: 'post-new',
                            createDate: new Date()
                        });
                    });

                    // send email to all friends
                    User.find()
                        .select('email')
                        .where('_id').in(notifiedUser)
                        .where('logicDelete').equals(false)
                        .exec(function(err, users) {

                            if (err) callback(err);
                            else {

                                // send new-post mail
                                Mailer.newPost(users, {
                                    _id: post._id,
                                    authorId: req.user.id,
                                    authorName: req.user.firstName + ' ' + req.user.lastName,
                                    authorPhoto: req.user.photo,
                                    content: post.content
                                });
                            }
                        });

                    // the last result is the created post
                    callback(null, postObj);
                }
            });
        }

    ], function(err, post) {

        if (err) next(err);
        // return the created post
        else res.json(post);
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