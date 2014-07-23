var _ = require('underscore'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Mailer = require('../mailer/mailer.js'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Message = mongoose.model('Message');

var populateField = {
    '_from': 'type firstName lastName title cover photo',
    '_recipient': 'type firstName lastName title cover photo'
};

// Messages index
// ---------------------------------------------
// Return a list of 20 messages in descending order of create date.
// Messages are highly private, all requests are relate to current user and can't be changed
// ---------------------------------------------
// Parameter:
//   1. type  : Messages type, "sent", "unread", "received"        default: received
//   2. fields: Comma separate select fields for output            default: none
//   3. embed : Comma separate embeded fields for populate         default: none
//   4. sort  : Fields name used for sort                          default: createDate
//   5. before: A Unix time stamp used as start point of retrive   default: none
//   6. size  : record number of query                             default: 20
// ---------------------------------------------

exports.index = function(req, res, next) {

    // create query
    var query = Message.find();

    // if request specified sent messages
    if (req.query.type == 'sent')
        query.where('_from').equals(req.user.id);

    // if request specified unread messages
    else if (req.query.type == 'unread')
        query.where('_recipient').equals(req.user.id)
             .where('opened').ne(req.user.id);

    // default request received messages
    else
        query.where('_recipient').equals(req.user.id);

    // if request specified output fields
    if (req.query.fields)
        query.select(req.query.fields.replace(/,/g, ' '));

    // if request specified population
    if (req.query.embed) {
        req.query.embed.split(',').forEach(function(field) {
            query.populate(field, populateField[field]);
        });
    }

    // if request items before some time point
    if (req.query.before)
        query.where('createDate').lt(moment.unix(req.query.before).toDate());

    // if request specified sort order and pagination
    var sort = req.query.sort || '-createDate',
        size = req.query.size || 20;

    query.where('logicDelete').ne(req.user.id)
        .limit(size)
        .sort(sort)
        .exec(function(err, messages) {
            if (err) next(err);
            else if (messages.length === 0) res.json(404, {});
            else res.json(messages);
        });
};

// Message count
// ---------------------------------------------
// Return the number messages of current user, in request specified criteria.
// Messages are private, all requests are relate to current user and can't be changed
// ---------------------------------------------
// Parameter:
//   1. type  : The type of messages, "sent", "unread", "received" default: received
// ---------------------------------------------

exports.count = function(req, res, next) {

    // create query
    var query = Message.count();

    // if request specified sent messages
    if (req.query.type == 'sent')
        query.where('_from').equals(req.user.id);

    // if request specified unread messages
    else if (req.query.type == 'unread')
        query.where('_recipient').equals(req.user.id)
             .where('opened').ne(req.user.id);

    // default request received messages
    else
        query.where('_recipient').equals(req.user.id);

    query.where('logicDelete').ne(req.user.id)
        .exec(function(err, count) {
            if (err) next(err);
            else res.json({count: count});
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
                type: 'message-new',
                targetMessage: message._id
            }, function(err) {
                if (err) next(err);
            });

            // populate the message with user's info
            message.populate({path:'_from', select: 'type firstName lastName title cover photo createDate'}, function(err, msg) {

                if(err) next(err);
                // send real time message
                else {

                    msg._recipient.forEach(function(room) {
                        sio.sockets.in(room).emit('message-new', msg);
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