var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Profile = mongoose.model('Profile');

var msgAuthFailedTitle = "アカウントが存在しません",
    msgAuthFailed = "ユーザIDとパースワードを確かめて、もう一度ご入力ください。",
    msgMissAuthInfoTitle = "アカウント情報を入力してください",
    msgMissAuthInfo = "ログインするには、メールアドレスとパースワード両方ご入力する必要があります。";

exports.login = function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password) {
        res.status(400).json({
            title: msgMissAuthInfoTitle,
            msg: msgMissAuthInfo
        });
    }

    // look up user info
    User.findOne(req.body, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if the account not found, return the fail message
        else if (!user) {
            res.status(401).json({
                title: msgAuthFailedTitle,
                msg: msgAuthFailed
            });
        }
        // if account could be found
        else {
            // put account into session
            req.session.user = user;
            res.json({
                msg: "welcome!"
            });
        }
    });
};

exports.logout = function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
};

// Get user index
exports.index = function(req, res, next) {
};

// Get single user
exports.show = function(req, res, next) {

    User.findById(req.params.id, '-password')
        .populate('profile')
        .exec(function(err, user) {
            if (err) next(err);
            else res.json(user);
        });
};

exports.introduce = function(req, res, next) {

    User.findById(req.session.user._id, function(err, user) {

        var query = User.find({_id: {'$ne': req.session.user._id}})
                    .select('type profile createDate')
                    .where('_id').nin(user.friends)
                    .populate('profile', 'firstName lastName title gender photo')
                    .sort({createDate:-1});

        query.exec(function(err, users) {
            if (err) next(err);
            else
                // return the user
                res.json(users);
        });
    });
};

exports.suggest = function(req, res, next) {

    var initial = req.query.initial;

    var query = Profile.find({_id: {'$ne': req.session.user.profile}})
                .or([{firstName: new RegExp(initial, "i")}, {lastName: new RegExp(initial, "i")}])
                .select('firstName lastName bio photo _owner')
                .populate('_owner')
                .limit(8);

    query.exec(function(err, users) {
        if (err) next(err);
        else
        // return the user
        res.json(users);
    });
};

exports.addFriend = function(req, res, next) {

    User.findById(req.params.id, function(err, user) {
        user.friends.push(req.body.userid);
        user.save(function(err, newUser) {
            if (err) next(err);
            else {
                User.findById(req.body.userid, function(err, friend) {
                    res.json(friend);
                });
            }
        });
    });
};

exports.removeFriend = function(req, res, next) {

    console.log(req.params);

    res.json("b");
};

exports.import = function(req, res, next) {

    if (req.body.engineers) {

        req.body.engineers.forEach(function(engineerData) {


            var user = new User({
                email: engineerData.email,
                password: engineerData.password,
                type: engineerData.type
            });

            var profile = new Profile(engineerData.profile);
            profile._owner = user;

            profile.save(function(err, newpro){
                if (err) next(err);
                else {
                    user.profile = profile._id;
                    user.save();
                }
            });

            // var newTag = new Tag(tagData, false);
            // newTag.save(function(err) {
            //     if (err) console.log(err);
            // });
        });
    }

    res.send('got it');
};

exports.events = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if account could be found
        else {
            // return user's event
            res.json(user.events);
        }
    });
};

exports.createEvent = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if account could be found
        else {

            var length = user.events.push(req.body);

            user.save(function(err, newUser) {
                if (err) next(err);
                else res.send(newUser.events[length - 1]);
            });
        }
    });
};

exports.updateEvent = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var event = user.events.id(req.params.eventid);

            if (event) {

                for(var prop in req.body) {
                    event[prop] = req.body[prop];
                }

                user.save(function(err, newUser) {
                    if (err) next(err);
                    else res.send(event);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });
};

exports.removeEvent = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var event = user.events.id(req.params.eventid);

            if (event) {

                var removedEvent = event.remove();

                user.save(function(err, newUser) {
                    if (err) next(err);
                    else res.send(removedEvent);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });
};
