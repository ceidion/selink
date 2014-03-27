var _ = require('underscore'),
    util = require('util'),
    mongoose = require('mongoose'),
    Job = mongoose.model('Job'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

exports.index = function(req, res, next) {

    var query = Job.find();

    // if requested for 'my' jobs
    if (req.params.user == req.user.id) {
        // not populate owner, cause client have
        query.where('_owner').equals(req.user.id);
    }

    query.where('logicDelete').equals(false)
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            res.json(jobs);
        });
};

exports.create = function(req, res, next) {

    _.extend(req.body, {_owner: req.user.id});

    Job.create(req.body, function(err, job) {

        if (err) next(err);
        else {

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-job',
                title: "新しい案件を公開しました。",
                content: req.body.name,
                link: 'user/' + req.user.id + '/posts/' + job._id
            }, function(err, activity) {
                if (err) next(err);
            });

            // create notification for job owner's friend
            Notification.create({
                _owner: req.user.friends,
                _from: req.user.id,
                type: 'user-job',
                content: req.body.name,
                link: 'user/' + req.user.id + '/posts/' + job._id
            }, function(err, notification) {

                if (err) next(err);
                else {
                    // populate the respond notification with user's info
                    notification.populate({path:'_from', select: '_id firstName lastName photo'}, function(err, noty) {

                        if(err) next(err);
                        // send real time message
                        sio.sockets.emit('user-job', noty);
                    });
                }
            });

            // send saved job back
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

    // TODO: check ownership

    Job.findByIdAndUpdate(req.params.job, {logicDelete: true}, function(err, job) {
        if (err) next(err);
        else res.json(job);
    });
};

exports.home = function(req, res, next) {

    Job.find()
        .where('logicDelete').equals(false)
        .where('expiredDate').gt(new Date())
        .populate('_owner', 'firstName lastName photo')
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            res.json(jobs);
        });
};