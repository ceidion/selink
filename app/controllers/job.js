var mongoose = require('mongoose'),
    Job = mongoose.model('Job');

exports.create = function(req, res) {

    // create job object
    var job = new Job(req.body, false);

    // save job object
    job.save(function(err) {

        // handle error
        if (err) next(err);
        else {

            // send notifications
            // send success message
            res.json({
                msg: "仕事を作成しました！"
            });
        }
    });
};