var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.index = function(req, res, next) {

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

exports.create = function(req, res, next) {

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

exports.update = function(req, res, next) {

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

exports.remove = function(req, res, next) {

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