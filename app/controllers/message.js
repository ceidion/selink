var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Message = mongoose.model('Message');

exports.messages = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if account could be found
        else {
            // return user's messages
            res.json(user.messages);
        }
    });
};

exports.createMessage = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {

        // pass if error happend
        if (err) next(err);
        // if account could be found
        else {

            // create the message
            var message = new Message(req.body);

            // save it
            message.save(function(err, newMessage) {

                if (err) next(err);

                // push this message to user's sent box
                user.sents.push(newMessage._id);

                // save user
                user.save(function(err, newUser) {
                    if (err) next(err);
                    // give back the message
                    else res.json(newMessage);
                });
            });
        }
    });
};

exports.removeMessage = function(req, res, next) {

    // look up user info
    User.findById(req.params.id, function(err, user) {
        if (err) next(err);
        else {

            var message = user.messages.id(req.params.messageid);

            if (message) {

                var removedMessage = message.remove();

                user.save(function(err, newUser) {
                    if (err) next(err);
                    else res.send(removedMessage);
                });
            } else {
                res.status(404).json({
                    msg: "更新失敗しました"
                });
            }
        }
    });
};
