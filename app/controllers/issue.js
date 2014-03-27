var _ = require('underscore'),
    mongoose = require('mongoose'),
    Issue = mongoose.model('Issue');

exports.index = function(req, res, next) {

    Issue.find({logicDelete: false}, function(err, issues) {

        if (err) next(err);
        else res.json(issues);
    });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_owner: req.user.id});

    Issue.create(req.body, function(err, issue) {

        if (err) next(err);
        else res.json(issue);
    });
};

exports.update = function(req, res, next) {

    var newIssue = _.omit(req.body, '_id');

    Issue.findByIdAndUpdate(req.params.issue, newIssue, function(err, issue) {

        if (err) next(err);
        else res.json(issue);
    });
};

exports.remove = function(req, res, next) {

    Issue.findByIdAndRemove(req.params.issue, function(err, issue) {

        if (err) next(err);
        else res.json(issue);
    });
};