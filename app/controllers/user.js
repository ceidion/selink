var mongoose = require('mongoose'),
    User = mongoose.model('User');

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

// Get single user
exports.show = function(req, res, next) {

    User.findById({
        _id: req.params.id
    }, function(err, user) {
        if (err) next(err);
        console.log(profile);
        if (user) {
            user.delete('password');
            res.json(profile);
        }
    });
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