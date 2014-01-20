var util = require('util');
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Job = mongoose.model('Job');

exports.index = function(req, res, next) {

    Job.find({
        owner: req.params.id
    }, function(err, jobs) {
        if (err) next(err);
        res.json(jobs);
    });
};

exports.create = function(req, res, next) {

    console.log("request body: " + util.inspect(req.body));
    console.log("request params: " + util.inspect(req.params));
    console.log("request attach: " + util.inspect(req.files));

    // create job object
    var job = new Job(req.body, false);

    job.set('owner', req.params.id);

    // save job object
    job.save(function(err, newJob) {

        // handle error
        if (err) next(err);
        else {

            // send notifications
            // send success message
            res.json(newJob);
        }
    });
};

exports.update = function(req, res, next) {

    // look up job info
    Job.findById(req.params.jobid, function(err, job) {
        if (err) next(err);
        else {

            for(var prop in req.body) {
                job[prop] = req.body[prop];
            }

            job.save(function(err, newJob) {
                if (err) next(err);
                else res.json(newJob);
            });
        }
    });
};

exports.remove = function(req, res, next) {

    // look up job info
    Job.findById(req.params.id, function(err, job) {
        if (err) next(err);
        else {

            job.remove(function(err, removedJob) {
                if (err) next(err);
                else res.json(removedJob);
            });
        }
    });
};