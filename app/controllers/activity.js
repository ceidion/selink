var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity');

var dictionary = {

    entity: {
        profile: "プロフィール",
        event: "イベント"
    },
    method: {
        post: "追加",
        patch: "更新",
        delete: "削除"
    }
};

exports.index = function(req, res, next) {

    if (req.params.id) {

        Activity.find({_owner: req.params.id}, function(err, activities) {
            if (err) next(err);
            else res.json(activies);
        });
    } else {

    }

};

exports.create = function(req, res, next) {

    Activity.create({
        _owner: req.session.user._id,
        type: req.body.type,
        title: req.body.title
    }, function(err, newActivity) {
        if (err) next(err);
        else res.json(newActivity);
    });
};

exports.remove = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var message = user.messages.id(req.params.messageid);

            if (message) {

                var removedActivity = message.remove();

                user.save(function(err, newUser) {
                    if (err) next(err);
                    else res.send(removedActivity);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });
};

exports.profileLog = function(req, res, next) {

    console.log(req.route);

    Activity.create({
        _owner: req.session.user._id,
        type: 'profileUpdate',
        title: "プロフィールを" + dictionary.method[req.route.method] + "しました"
    }, function(err, newActivity) {
        if (err) next(err);
        else next();
    });
};