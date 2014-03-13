var _ = require('underscore'),
    mongoose = require('mongoose'),
    Event = mongoose.model('Event');

exports.index = function(req, res, next) {

    Event.find({_owner: req.user.id}, function(err, events) {

        if (err) next(err);
        else res.json(events);
    });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_owner: req.user.id});

    Event.create(req.body, function(err, event) {

        if (err) next(err);
        else res.json(event);
    });
};

exports.update = function(req, res, next) {

    var newEvent = _.omit(req.body, '_id');

    Event.findByIdAndUpdate(req.params.event, newEvent, function(err, event) {

        if (err) next(err);
        else res.json(event);
    });
};

exports.remove = function(req, res, next) {

    Event.findByIdAndRemove(req.params.event, function(err, event) {

        if (err) next(err);
        else res.json(event);
    });
};