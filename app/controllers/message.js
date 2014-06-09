var _ = require('underscore'),
    mongoose = require('mongoose'),
    Mailer = require('../mailer/mailer.js'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Message = mongoose.model('Message');

exports.index = function(req, res, next) {

    var category = req.query.category || null, // category of request
        page = req.query.page || 0;            // page number

    var query = Message.find();

    if (category == 'sent')
        query.where('_from').equals(req.user.id)
             .populate('_recipient', 'type firstName lastName title cover photo createDate');

    else if (category == 'unread')
        query.where('_recipient').equals(req.user.id)
             .where('opened').ne(req.user.id);

    else
        query.where('_recipient').equals(req.user.id);

    query.where('logicDelete').ne(req.user.id)
        .populate('_from', 'type firstName lastName title cover photo createDate')
        .skip(20*page)  // skip n page
        .limit(20)
        .sort('-createDate')
        .exec(function(err, messages) {
            if (err) next(err);
            else res.json(messages);
        });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_from: req.user.id, _recipient: req.body.recipient});

    Message.create(req.body, function(err, message) {

        if (err) next(err);
        else {

            // log user's activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-message',
                target: message._id
            }, function(err) {
                if (err) next(err);
            });

            // populate the message with user's info
            message.populate({path:'_from', select: 'type firstName lastName title cover photo createDate'}, function(err, msg) {

                if(err) next(err);
                // send real time message
                else {

                    msg._recipient.forEach(function(room) {
                        sio.sockets.in(room).emit('user-message', msg);
                    });

                    // send email to all recipients
                    User.find()
                        .select('email')
                        .where('_id').in(msg._recipient)
                        .where('logicDelete').equals(false)
                        .exec(function(err, recipients) {
                            // send new-message mail
                            Mailer.newMessage(recipients, {
                                _id: msg._id,
                                authorName: req.user.firstName + ' ' + req.user.lastName,
                                authorPhoto: req.user.photo,
                                subject: msg.subject,
                                content: msg.content
                            });
                        });

                    res.json(msg);
                }
            });

        }
    });
};

exports.update = function(req, res, next) {

    // no way to update a sent message, the only updatable field is 'opened' and 'bookmarked'
    if (_.has(req.body, 'opened')) {

        // find that message
        Message.findById(req.params.message, function(err, message) {

            if (err) next(err);
            else {

                if (req.body.opened)
                    // add user to the opened list
                    message.opened.addToSet(req.user.id);
                else
                    message.opened.pull(req.user.id);

                message.save(function(err, newMessage) {

                    if (err) next(err);
                    else {

                        newMessage.populate({path:'_from', select: 'type firstName lastName title cover photo createDate'}, function(err, msg) {

                            if (err) next(err);
                            else res.json(msg);
                        });
                    }
                });
            }
        });

    // send 'bad request'
    } else {
        res.json(400, {});
    }
};

exports.remove = function(req, res, next) {

    // message could be sent to multiple people,
    // one recipient deleted it dosen't mean the other recipients delete it.
    // so message's logicDelete flag is an array, filled by the user's id who deleted it

    // find the message
    Message.findById(req.params.message, function(err, message) {

        if (err) next(err);
        else {

            // mark it as logical deleted by this user
            message.logicDelete.addToSet(req.user.id);

            message.save(function(err, deletedMessage) {

                if (err) next(err);
                else res.json(deletedMessage);
            });
        }
    });
};

// bookmark messages
exports.bookmark = function(req, res, next){

    // find message
    Message.findById(req.params.message, function(err, message) {

        if (err) next(err);
        else {

            // check if the user bookmarked this message, then toggle it
            if (message.bookmarked.indexOf(req.body.bookmarked) < 0)
                // add one bookmarked people id
                message.bookmarked.addToSet(req.body.bookmarked);
            else
                // remove the people id from bookmarked list
                message.bookmarked.remove(req.body.bookmarked);

            // save the message
            message.save(function(err, newMessage) {
                if (err) next(err);
                else {

                    // populate the message sender
                    // cause if user reply this message just after bookmark it, the sender info is needed.
                    newMessage.populate({path:'_from', select: 'type firstName lastName title cover photo createDate'}, function(err, message) {
                        if(err) next(err);
                        else res.json(message);
                    });
                }
            });
        }
    });
};