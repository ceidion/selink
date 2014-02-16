var _ = require('underscore'),
    request = require('request'),
    mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

// Activity index
exports.index = function(req, res, next) {

    var date = moment(req.params.date, "YYYYMMDD").toDate();

    if (req.params.id) {

        Activity.find({_owner: req.params.id, createDate: {'$gte': date}})
            .sort('-createDate')
            .limit(20)
            .exec(function(err, activities) {
                if (err) next(err);
                else res.json(activies);
            });

    } else {

        request({
            url: 'http://localhost:8080/selink/mobile/api/employee.htm?pageAction=getEmployeeList',
            json: true
        }, function(err, response, body) {
            console.log(body);
        });

        Activity.find({createDate: {'$gte': date}})
            .sort('-createDate')
            .populate('_owner', 'profile')
            .limit(20)
            .exec(function(err, activities) {
                if (err) next(err)
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