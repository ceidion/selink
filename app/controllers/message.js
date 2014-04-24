var _ = require('underscore'),
    mongoose = require('mongoose'),
    Message = mongoose.model('Message');

exports.index = function(req, res, next) {

    Message.find({_owner: req.user.id}, function(err, messages) {

        if (err) next(err);
        else res.json(messages);
    });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_from: req.user.id, _recipient: req.body.recipient});

    Message.create(req.body, function(err, message) {

        if (err) next(err);
        else res.json(message);
    });
};

exports.update = function(req, res, next) {

    var newMessage = _.omit(req.body, '_id');

    Message.findByIdAndUpdate(req.params.message, newMessage, function(err, message) {

        if (err) next(err);
        else res.json(message);
    });
};

exports.remove = function(req, res, next) {

    Message.findByIdAndRemove(req.params.message, function(err, message) {

        if (err) next(err);
        else res.json(message);
    });
};