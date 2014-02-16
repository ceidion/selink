var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Profile = mongoose.model('Profile'),
    Activity = mongoose.model('Activity');

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

    // update profile
    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {
            for(var prop in req.body) {
                profile[prop] = req.body[prop];
            }
            profile.save(function(err, newProfile) {
                if (err) next(err);
                else res.send(newProfile);
            });
        }
    });
};

// Create new sub document
exports.createSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var length = profile[req.params.sub].push(req.body);

            profile.save(function(err, newProfile) {
                if (err) next(err);
                else res.send(newProfile[req.params.sub][length - 1]);
            });
        }
    });
};

// Edit sub document
exports.updateSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var subDoc = profile[req.params.sub].id(req.params.subid);

            if (subDoc) {

                for(var prop in req.body) {
                    subDoc[prop] = req.body[prop];
                }

                profile.save(function(err, newProfile) {
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

exports.removeSubDocument = function(req, res, next) {

    Profile.findById(req.params.id, function(err, profile) {
        if (err) next(err);
        else {

            var subDoc = profile[req.params.sub].id(req.params.subid);

            if (subDoc) {

                var removedDoc = subDoc.remove();

                profile.save(function(err, newProfile) {
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
                    .select('type profile createDate')
                    .where('_id').nin(user.friends)
                    .populate('profile', 'firstName lastName title gender photo')
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

exports.import = function(req, res, next) {

    if (req.body.engineers) {

        req.body.engineers.forEach(function(engineerData) {

            User.create(engineerData);
        });
    }

    res.send('got it');
};
