var _ = require('underscore'),
    fs = require('fs'),
    gm = require('gm'),
    mongoose = require('mongoose'),
    util = require('util'),
    path = require('path'),
    User = mongoose.model('User'),
    Post = mongoose.model('Post'),
    Job = mongoose.model('Job'),
    Announcement = mongoose.model('Announcement'),
    Activity = mongoose.model('Activity');

// User login
exports.login = function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password)
        res.json(400, {});

    // look up user info
    User.findOne(req.body, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if the account not found, return the fail message
        else if (!user) res.json(401, {});
        // if account could be found
        else {

            // put user's id into session
            req.session.userId = user.id;

            // create activity
            Activity.create({
                _owner: user.id,
                type: 'user-login'
            }, function(err, activity) {
                if (err) next(err);
            });

            user.friends.forEach(function(room) {
                sio.sockets.in(room).emit('user-login', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    photo: user.photo
                });
            });

            // send success singnal
            res.json({});
        }
    });
};

// User logout
exports.logout = function(req, res, next) {

    // create activity
    Activity.create({
        _owner: req.session.userId,
        type: 'user-logout'
    }, function(err, activity) {
        if (err) next(err);
    });

    req.session.destroy();
    res.redirect('/');
};

// Get user index
exports.index = function(req, res, next) {
};

// Get single user
exports.show = function(req, res, next) {


    // // if requested for 'my' info
    // if (req.params.user == req.user.id){

    // // others info
    // } else {

    // }

    User.findById(req.params.user, '-password')
        .populate('friends', 'type firstName lastName title cover photo createDate')
        .populate('invited', 'type firstName lastName title cover photo createDate')
        .exec(function(err, user) {

            if (err) next(err);
            else {

                Post.count({_owner: req.params.user}, function(err, postNum) {

                    if (err) next(err);
                    else {

                        var userObj = user.toObject();
                            userObj.postNum = postNum;

                        res.json(userObj);
                    }
                });
            }
        });
};

// Edit Profile
exports.update = function(req, res, next) {

    delete req.body._id;

    // update user info
    User.findByIdAndUpdate(req.params.id, req.body, function(err, updatedUser) {
        if (err) next(err);
        else res.send(updatedUser);
    });
};

// Upload Photo
exports.uploadPhoto = function(req, res, next) {

    // handle photo file
    if (req.files && req.files.photo) {

        console.log(req.files.photo);

        var photoType = req.files.photo.type;
        var photoPath = req.files.photo.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(photoType) === -1) {
            res.status(415).send("Only jpeg, gif or png file are valide");
            return;
        }

        var photoName = /.*[\/|\\](.*)$/.exec(photoPath)[1];

        req.session.tempPhoto = photoName;

        gm(photoPath).size(function(err, size) {
            if (err) next(err);
            else res.json({fileName: './upload/' + photoName});
        });

    } else {
        res.json(400, {});
    }
};

// Scale Photo
exports.scalePhoto = function(req, res, next) {

    // TODO: check exsitence of tempPhoto

    var photoPath = path.join(__dirname, '../../public/upload/', req.session.tempPhoto);

    gm(photoPath)
        .crop(req.body.w, req.body.h, req.body.x, req.body.y)
        .resize(200, 200)
        .write(photoPath, function(err) {
            if (err) next(err);
            else {

                // update user info
                User.findByIdAndUpdate(req.params.user, {photo: './upload/' + req.session.tempPhoto}, function(err, updatedUser) {
                    if (err) next(err);
                    else res.send({photo: updatedUser.photo});
                });
            }
        });
};

// Upload Cover
exports.uploadCover = function(req, res, next) {

    // handle cover file
    if (req.files && req.files.cover) {

        console.log(req.files.cover);

        var coverType = req.files.cover.type;
        var coverPath = req.files.cover.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(coverType) === -1) {
            res.status(415).send("Only jpeg, gif or png file are valide");
            return;
        }

        var coverName = /.*[\/|\\](.*)$/.exec(coverPath)[1];

        req.session.tempCover = coverName;

        gm(coverPath).size(function(err, size) {
            if (err) next(err);
            else res.json({fileName: './upload/' + coverName});
        });

    } else {
        res.json(400, {});
    }
};

// Scale Cover
exports.scaleCover = function(req, res, next) {

    // TODO: check exsitence of tempCover

    var coverPath = path.join(__dirname, '../../public/upload/', req.session.tempCover);

    gm(coverPath)
        .crop(req.body.w, req.body.h, req.body.x, req.body.y)
        .write(coverPath, function(err) {
            if (err) next(err);
            else {

                // update user info
                User.findByIdAndUpdate(req.params.user, {cover: './upload/' + req.session.tempCover}, function(err, updatedUser) {
                    if (err) next(err);
                    else res.send({cover: updatedUser.cover});
                });
            }
        });
};

// Create new sub document
exports.createSubDocument = function(req, res, next) {

    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var length = user[req.params.sub].push(req.body);

            user.save(function(err, updatedUser) {
                if (err) next(err);
                else res.send(updatedUser[req.params.sub][length - 1]);
            });
        }
    });
};

// Edit sub document
exports.updateSubDocument = function(req, res, next) {

    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var subDoc = user[req.params.sub].id(req.params.subid);

            if (subDoc) {

                for(var prop in req.body) {
                    subDoc[prop] = req.body[prop];
                }

                user.save(function(err, updatedUser) {
                    if (err) next(err);
                    else res.send(subDoc);
                });
            } else {
                res.json(404, {});
            }
        }
    });

};

// Remove sub document
exports.removeSubDocument = function(req, res, next) {

    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var subDoc = user[req.params.sub].id(req.params.subid);

            if (subDoc) {

                var removedDoc = subDoc.remove();

                user.save(function(err, updatedUser) {
                    if (err) next(err);
                    else res.send(removedDoc);
                });
            } else {
                res.json(404, {});
            }
        }
    });
};

exports.newsfeed = function(req, res, next) {

    // page number
    var page = req.query.page || 0;

    Post.find()
        .where('logicDelete').equals(false)
        .populate('_owner', 'type firstName lastName title cover photo createDate')
        .populate('comments._owner', 'type firstName lastName title cover photo createDate')
        .sort('-createDate')
        .skip(10*page)  // skip n page
        .limit(10)
        .exec(function(err, posts) {
            if (err) next(err);
            else {

                Job.find()
                    .where('logicDelete').equals(false)
                    .where('expiredDate').gt(new Date())
                    .populate('_owner', 'type firstName lastName title cover photo createDate')
                    .sort('-createDate')
                    .skip(10*page)  // skip n page
                    .limit(10)
                    .exec(function(err, jobs) {
                        if (err) next(err);
                        else {

                            Announcement.find()
                                .where('logicDelete').equals(false)
                                .where('expiredDate').gt(new Date())
                                .sort('-createDate')
                                .skip(10*page)  // skip n page
                                .limit(10)
                                .exec(function(err, announcements) {
                                    if (err) next(err);
                                    else res.json(_.union(jobs, posts, announcements));
                                });
                        }
                    });
            }
        });
};

exports.import = function(req, res, next) {

    if (req.body.engineers) {

        req.body.engineers.forEach(function(engineerData) {

            User.create(engineerData);
        });
    }

    res.send('got it');
};
