var _ = require('underscore'),
    request = require('request'),
    mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

// Activity index
exports.index = function(req, res, next) {

    if (req.params.id) {

        Activity.find()
            .sort('-createDate')
            .limit(20)
            .exec(function(err, activities) {
                if (err) next(err);
                else res.json(activies);
            });

    } else {

        // request({
        //     url: 'http://localhost:8080/selink/mobile/api/employee.htm?pageAction=getEmployeeList',
        //     json: true
        // }, function(err, response, body) {
        //     console.log(body);
        // });

        Activity.find()
            .sort('-createDate')
            .limit(20)
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