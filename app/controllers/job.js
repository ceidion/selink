var _ = require('underscore'),
    mongoose = require('mongoose'),
    Job = mongoose.model('Job'),
    User = mongoose.model('User'),
    Activity = mongoose.model('Activity'),
    Notification = mongoose.model('Notification');

// Job Index
exports.index = function(req, res, next) {

    // page number
    var page = req.query.page || 0;

    var query = Job.find();

    // // if requested for 'my' jobs
    // if (req.params.user == req.user.id) {
    //     // not populate owner, cause client have
    //     query.where('_owner').equals(req.user.id);
    // }

    query.where('_owner').equals(req.user.id)
        .where('logicDelete').equals(false)
        .populate('_owner', 'firstName lastName photo')
        .skip(20*page)  // skip n page
        .limit(20)
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            res.json(jobs);
        });
};

// Show single post
exports.show = function(req, res, next) {

    Job.findById(req.params.job)
        .where('logicDelete').equals(false)
        .exec(function(err, posts) {
            if (err) next(err);
            else res.json(posts);
        });
};

// Create Job
exports.create = function(req, res, next) {

    // set job's owner as current user
    _.extend(req.body, {_owner: req.user.id});

    // create job
    Job.create(req.body, function(err, job) {

        if (err) next(err);
        else {

            // create activity
            Activity.create({
                _owner: req.user.id,
                type: 'user-job',
                target: job._id
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
                    notification.populate({
                        path:'_from',
                        select: 'firstName lastName photo'
                    }, function(err, noty) {
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

// Update Job
exports.update = function(req, res, next) {

    // TODO: check ownership

    console.log("message##############");

    var newJob = _.omit(req.body, '_id');

    Job.findByIdAndUpdate(req.params.job, newJob, function(err, job) {
        if (err) next(err);
        else res.json(job);
    });
};

// Remove Job
exports.remove = function(req, res, next) {

    // TODO: check ownership

    Job.findByIdAndUpdate(req.params.job, {logicDelete: true}, function(err, job) {
        if (err) next(err);
        else res.json(job);
    });
};

exports.news = function(req, res, next) {

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