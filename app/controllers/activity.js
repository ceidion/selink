var request = require('request'),
    mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

// Activity index
exports.index = function(req, res, next) {

    // if the user id was passed
    if (req.params.id) {

        // find the activities of specific user
        Activity.find({_owner: req.params.id})
            .sort('-createDate')
            .limit(20)
            .populate('_owner', 'firstName lastName photo')
            .exec(function(err, activities) {
                if (err) next(err);
                else res.json(activities);
            });

    } else {

        // request({
        //     url: 'http://localhost:8080/selink/mobile/api/employee.htm?pageAction=getEmployeeList',
        //     json: true
        // }, function(err, response, body) {
        //     console.log(body);
        // });
        // find the activities of all users
        Activity.find()
            .sort('-createDate')
            .limit(20)
            .populate('_owner', 'firstName lastName photo')
            .exec(function(err, activities) {
                if (err) next(err);
                else res.json(activities);
            });
    }
};

exports.create = function(req, res, next) {

    Activity.create({
        _owner: req.session.user._id,
        type: req.body.type,
        title: req.body.title
    }, function(err, newActivity) {
        if (err) next(err);
        else res.json(newActivity);
    });
};