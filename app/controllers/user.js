var mongoose = require('mongoose'),
    util = require('util'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity');

var msgAuthFailedTitle = "アカウントが存在しません",
    msgAuthFailed = "ユーザIDとパースワードを確かめて、もう一度ご入力ください。",
    msgMissAuthInfoTitle = "アカウント情報を入力してください",
    msgMissAuthInfo = "ログインするには、メールアドレスとパースワード両方ご入力する必要があります。";

// User login
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

            Activity.create({
                _owner: user._id,
                type: 'user-login',
                title: "ログインしました。"
            }, function(err, activity) {
                if (err) next(err);
            });

            res.json({
                msg: "welcome!"
            });
        }
    });
};

// User logout
exports.logout = function(req, res, next) {

    Activity.create({
        _owner: req.session.user._id,
        type: 'user-logout',
        title: "ログアウトしました。"
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

    User.findById(req.params.id, '-password')
        .exec(function(err, user) {
            if (err) next(err);
            else res.json(user);
        });
};

// Edit Profile
exports.update = function(req, res, next) {

    console.log("request body: " + util.inspect(req.body));
    console.log("request params: " + util.inspect(req.params));
    console.log("request attach: " + util.inspect(req.files));
    delete req.body._id;

    // handle photo file
    if (req.files && req.files.photo) {
        var photoType = req.files.photo.type;
        var photoPath = req.files.photo.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(photoType) === -1) {
            res.status(415).send("Only jpeg, gif or png file are valide");
            return;
        }

        var photoName = /.*[\/|\\](.*)$/.exec(photoPath)[1];
        req.body.photo = 'http://localhost:8081/upload/' + photoName;
    }

    // update user info
    User.findByIdAndUpdate(req.params.id, req.body, function(err, updatedUser) {
        if (err) next(err);
        else res.send(updatedUser);
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
                res.status(404).json({
                    msg: "更新失敗しました"
                });
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
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });
};

exports.introduce = function(req, res, next) {

    User.findById(req.session.user._id, function(err, user) {

        var query = User.find({_id: {'$ne': req.session.user._id}})
                    .select('type firstName lastName title gender photo createDate')
                    .where('_id').nin(user.friends)
                    .sort({createDate:-1})
                    .limit(20);

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

    var query = User.find({_id: {'$ne': req.session.user._id}})
                .or([{firstName: new RegExp(initial, "i")}, {lastName: new RegExp(initial, "i")}])
                .select('firstName lastName bio photo')
                .limit(8);

    query.exec(function(err, users) {
        if (err) next(err);
        else
        // return the user
        res.json(users);
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
