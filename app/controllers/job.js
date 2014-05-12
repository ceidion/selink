var _ = require('underscore'),
    _s = require('underscore.string'),
    util = require('util'),
    Mailer = require('../mailer/mailer.js'),
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
        .populate('_owner', 'type firstName lastName title photo createDate')
        .skip(20*page)  // skip n page
        .limit(20)
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            else res.json(jobs);
        });
};

// Show single job
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
                target: job.id
            }, function(err, notification) {

                if (err) next(err);
                else {

                    // populate the respond notification with user's info
                    notification.populate({
                        path:'_from',
                        select: 'type firstName lastName title photo createDate'
                    }, function(err, noty) {
                        if(err) next(err);
                        // send real time message
                        else
                            req.user.friends.forEach(function(room) {
                                sio.sockets.in(room).emit('user-job', noty);
                            });
                    });
                }
            });

            // send email to all friends
            User.find()
                .select('email')
                .where('_id').in(req.user.friends)
                .where('logicDelete').equals(false)
                .exec(function(err, users) {
                    // send new-job mail
                    Mailer.newJob(users, {
                        _id: job._id,
                        authorName: req.user.firstName + ' ' + req.user.lastName,
                        authorPhoto: req.user.photo,
                        name: job.name,
                        summary: job.remark
                    });
                });

            // send saved job back
            job.populate('_owner', 'type firstName lastName title photo createDate', function(err, job) {

                if (err) next(err);
                else res.json(job);
            });

        }
    });

};

// Update Job
exports.update = function(req, res, next) {

    // TODO: check ownership

    var newJob = _.omit(req.body, '_id');

    Job.findByIdAndUpdate(req.params.job, newJob, function(err, job) {
        if (err) next(err);
        else {

            // send saved job back
            job.populate('_owner', 'type firstName lastName title photo createDate', function(err, job) {

                if (err) next(err);
                else res.json(job);
            });
        }
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
        .populate('_owner', 'type firstName lastName title photo createDate')
        .sort('-createDate')
        .exec(function(err, jobs) {
            if (err) next(err);
            res.json(jobs);
        });
};

// bookmark job
exports.bookmark = function(req, res, next){

    // find job
    Job.findById(req.params.job, function(err, job) {

        if (err) next(err);
        else {

            // add one bookmarked people id
            job.bookmarked.addToSet(req.body.bookmarked);

            // save the job
            job.save(function(err, newJob) {

                if (err) next(err);
                else {

                    // if someone not job owner bookmarked this job
                    if (newJob._owner != req.user.id) {

                        // create activity
                        Activity.create({
                            _owner: req.body.bookmarked,
                            type: 'user-job-bookmarked',
                            target: newJob._id
                        }, function(err, activity) {
                            if (err) next(err);
                        });

                        // create notification for job owner
                        Notification.create({
                            _owner: [newJob._owner],
                            _from: req.body.bookmarked,
                            type: 'user-job-bookmarked',
                            target: newJob._id
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
                                    sio.sockets.in(newJob._owner).emit('user-job-bookmarked', noty);
                                });
                            }
                        });
                    }

                    // return the saved job
                    res.json(newJob);
                }
            });
        }
    });
};

exports.match = function(req, res, next) {

    // find job
    Job.findById(req.params.job, function(err, job) {

        if (err) next(err);
        else {

            var languages = _.map(job.languages, function(language) {
                return language.language;
            });

            var skills = _.map(job.skills, function(skill) {
                return skill.skill;
            });

            var solrQuery = solr.createQuery()
                                .q({
                                    languages: languages,
                                    skills: skills
                                })
                                .matchFilter('type', 'user')
                                .fl('id,score');

            console.log(solrQuery.build());

            solr.search(solrQuery, function(err, obj) {
                if (err) console.log(err);
                else {

                    console.log("#################");
                    console.log(util.inspect(obj));
                    console.log(util.inspect(obj.response.docs));
                    console.log("#################");

                    User.find()
                        .select('type firstName lastName title photo createDate')
                        .where('_id').in(_.pluck(obj.response.docs, 'id'))
                        .exec(function(err, users) {
                            if (err) next(err);
                            else res.json(users);
                        });
                }
            });
        }
    });
};

// commitToSolr = function(job, next) {

//     solr.add(job.toSolr(), function(err, solrResult) {
//         if (err) next(err);
//         else {
//             console.log(solrResult);
//             solr.commit(function(err,res){
//                if(err) console.log(err);
//                if(res) console.log(res);
//             });
//         }
//     });
// };