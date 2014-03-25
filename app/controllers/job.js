var _ = require('underscore'),
    util = require('util'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Job = mongoose.model('Job');

exports.index = function(req, res, next) {

    Job.find({_owner: req.params.user, logicDelete: false})
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            res.json(jobs);
        });
};

exports.create = function(req, res, next) {

    console.log("request body: " + util.inspect(req.body));
    console.log("request params: " + util.inspect(req.params));
    console.log("request attach: " + util.inspect(req.files));

    _.extend(req.body, {_owner: req.user.id});

    Job.create(req.body, function(err, job) {

        if (err) next(err);
        else {
            // send notifications
            // send success message
            res.json(job);
        }
    });

};

exports.update = function(req, res, next) {

    // TODO: check ownership

    var newJob = _.omit(req.body, '_id');

    Job.findByIdAndUpdate(req.params.job, newJob, function(err, job) {
        if (err) next(err);
        else res.json(job);
    });
};

exports.remove = function(req, res, next) {

    Job.findByIdAndUpdate(req.params.job, {logicDelete: true}, function(err, job) {
        if (err) next(err);
        else res.json(job);
    });
};